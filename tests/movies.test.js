require('dotenv').config();
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');

const {
  NODE_ENV = 'development',
  MONGO_URL_PROD,
  MONGO_DB_PROD,
} = process.env;

const { developmentEnvConstants } = require('../utils/developmentEnvConstants');

const errorMessages = require('../utils/errorMessages');

const { invalidAuthToken, newUser, currentUser } = require('./fixtures/testUserData');

const {
  anotherMovieId,
  invalidMovieId,
  newMovie,
  newMovieInvalidExample,
} = require('./fixtures/testMoviesData');

const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : developmentEnvConstants.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : developmentEnvConstants.MONGO_DB;

let token;
let userId;
let message;
let movieId;
let cookieData;

const request = supertest(app);

function getJwtToken(data) {
  return data.split(';')[0].split('=')[1];
}

beforeAll(() => {
  mongoose.set('strictQuery', true);
  mongoose.connect(`${MONGO_URL}/${MONGO_DB}`);
});

afterAll(() => {
  mongoose.disconnect(`${MONGO_URL}/${MONGO_DB}`);
});

function celebrateValidationTest(response, messageTest) {
  expect(response.message).toBe('Validation failed');
  expect(message.validation.body.message).toBe(messageTest);
}

describe('Testing movies-requests', () => {
  describe('Sign up', () => {
    it('Signup: сreate user with valid data, user doesnt exist', () => request
      .post('/api/signup')
      .send(newUser)
      .then((res) => {
        message = JSON.parse(res.text);
        const userData = message.data;
        userId = userData._id;
        expect(res.status).toBe(200);
        expect(message).toBeDefined();
        expect(userData._id).toBeDefined();
        expect(userData.email).toContain(newUser.email);
      }));
  });

  describe('Sign in', () => {
    it('Signin: login with valid data', () => request
      .post('/api/signin')
      .send(currentUser)
      .then((res) => {
        message = JSON.parse(res.text);
        cookieData = res.header['set-cookie'];
        token = `${getJwtToken(cookieData[0])}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('Movies: create new movie', () => {
    it('Movie: create movie with invalid data', () => request
      .post('/api/movies')
      .set('Cookie', `jwtMesto=${token}`)
      .send(newMovieInvalidExample)
      .then((res) => {
        message = JSON.parse(res.text);
        celebrateValidationTest(message, '"country" is not allowed to be empty');
      }));

    it('Movie: create movie with valid data, auth error', () => request
      .post('/api/movies')
      .set('Cookie', `jwtMesto=${invalidAuthToken}`)
      .send(newMovie)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: create movie with valid data', () => request
      .post('/api/movies')
      .set('Cookie', `jwtMesto=${token}`)
      .send(newMovie)
      .then((res) => {
        message = JSON.parse(res.text);
        movieId = message.data._id;
        expect(res.status).toBe(200);
        expect(newMovie.country).toBe(message.data.country);
        expect(newMovie.description).toBe(message.data.description);
      }));
  });

  describe('Movies: get saved movies', () => {
    it('Movie: get library, auth error', () => request
      .get('/api/movies')
      .set('Cookie', `jwtMesto=${invalidAuthToken}`)
      .send(newMovie)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: get library', () => request
      .get('/api/movies')
      .set('Cookie', `jwtMesto=${token}`)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(message.data).toBeDefined();
        expect(message.data.length).toBeGreaterThanOrEqual(1);
      }));
  });

  describe('Movies: delete movie (it`s created by current user)', () => {
    it('Movie: remove movie with valid id, auth error', () => request
      .delete(`/api/movies/${movieId}`)
      .set('Cookie', `jwtMesto=${invalidAuthToken}`)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: remove movie with id (user is not owner)', () => request
      .delete(`/api/movies/${anotherMovieId}`)
      .set('Cookie', `jwtMesto=${token}`)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(403);
      }));

    it('Movie: remove movie with invalid id', () => request
      .delete(`/api/movies/${invalidMovieId}`)
      .set('Cookie', `jwtMesto=${token}`)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
      }));
  });

  describe('Remove test-user data, check login', () => {
    it('User already exists, user cant sign up', () => request
      .post('/api/signup')
      .send(newUser)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(409);
        expect(message).toStrictEqual({
          message: errorMessages.userExistsError,
        });
      }));

    // remove test user data
    it('Remove all saved (by owner) movies from db', () => Movie.deleteMany({ owner: { _id: userId } }));
    it('Remove user from db', () => User.deleteOne({ email: newUser.email }));

    // try to sign in again => user doesnt exist
    it('User doesnt exist', () => request
      .post('/api/signin')
      .send(currentUser)
      .then((res) => {
        expect(res.status).toBe(401);
        message = JSON.parse(res.text);
        expect(message).toStrictEqual({
          message: errorMessages.wrongEmailPassword,
        });
      }));
  });

  describe('Invalid url, request method, crash test', () => {
    it('Check invalid url or method, example 1', () => {
      request.get('/api/movies/me/abc/def//', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.get('/api/movies/e/aaa/xxx/123', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Crash test', () => {
      request.get('/api/crash-test', (res) => {
        expect(res.status).toBe(500);
      });
    });
  });
});
