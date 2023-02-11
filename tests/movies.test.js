require('dotenv').config();
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');

const { MONGO_URL, MONGO_DB } = process.env;
const errorMessages = require('../utils/constants');

const { invalidAuthToken, newUser, currentUser } = require('./fixtures/testUserData');

const {
  anotherMovieId,
  invalidMovieId,
  newMovie,
  newMovieInvalidExample,
} = require('./fixtures/testMoviesData');

let token;
let userId;
let message;
let movieId;

const request = supertest(app);

beforeAll(() => {
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
      .post('/signup')
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
      .post('/signin')
      .send(currentUser)
      .then((res) => {
        message = JSON.parse(res.text);
        token = `Bearer ${message.token}`;
        expect(res.status).toBe(200);
        expect(token).toBeDefined();
      }));
  });

  describe('Movies: create new movie', () => {
    it('Movie: create movie with invalid data', () => request
      .post('/movies')
      .set('Authorization', token)
      .send(newMovieInvalidExample)
      .then((res) => {
        message = JSON.parse(res.text);
        celebrateValidationTest(message, '"country" is not allowed to be empty');
      }));

    it('Movie: create movie with valid data, auth error', () => request
      .post('/movies')
      .set('Authorization', invalidAuthToken)
      .send(newMovie)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: create movie with valid data', () => request
      .post('/movies')
      .set('Authorization', token)
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
      .get('/movies')
      .set('Authorization', invalidAuthToken)
      .send(newMovie)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: get library', () => request
      .get('/movies')
      .set('Authorization', token)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(message.data).toBeDefined();
        expect(message.data.length).toBeGreaterThanOrEqual(1);
      }));
  });

  describe('Movies: delete movie (it`s created by current user)', () => {
    it('Movie: remove movie with valid id, auth error', () => request
      .delete(`/movies/${movieId}`)
      .set('Authorization', invalidAuthToken)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
      }));

    it('Movie: remove movie with id (user is not owner)', () => request
      .delete(`/movies/${anotherMovieId}`)
      .set('Authorization', token)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(403);
      }));

    it('Movie: remove movie with invalid id', () => request
      .delete(`/movies/${invalidMovieId}`)
      .set('Authorization', token)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
      }));
  });

  describe('Remove test-user data, check login', () => {
    it('User already exists, user cant sign up', () => request
      .post('/signup')
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
      .post('/signin')
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
      request.get('/movies/me/abc/def//', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.get('/movies/e/aaa/xxx/123', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Crash test', () => {
      request.get('/crash-test', (res) => {
        expect(res.status).toBe(500);
      });
    });
  });
});
