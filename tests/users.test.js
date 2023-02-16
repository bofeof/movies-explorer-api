require('dotenv').config();
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const { NODE_ENV = 'development', MONGO_URL_PROD, MONGO_DB_PROD } = process.env;

const { developmentEnvConstants } = require('../utils/developmentEnvConstants');

const errorMessages = require('../utils/errorMessages');

const {
  invalidAuthToken,
  newUser,
  invalidNewUser,
  currentUser,
  currentUserInvalid,
  newUserInfo,
  newUserInfoInvalidEmail,
  newUserInfoInvalidName,
} = require('./fixtures/testUserData');

const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : developmentEnvConstants.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : developmentEnvConstants.MONGO_DB;

let token;
let userId;
let message;
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

describe('Testing user-requests', () => {
  describe('Sign up', () => {
    it('Signup: сreate user with invalid data', () => request
      .post('/api/signup')
      .send(invalidNewUser)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        celebrateValidationTest(message, '"email" must be a valid email');
      }));

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

    it('Signup: сreate user with valid data again, user already exists', () => request
      .post('/api/signup')
      .send(newUser)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(409);
        expect(message.message).toBe(errorMessages.userExistsError);
      }));
  });

  describe('Sign in', () => {
    it('Signin: login with invalid data', () => request
      .post('/api/signin')
      .send(currentUserInvalid)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        celebrateValidationTest(message, '"email" must be a valid email');
      }));

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

    it('Get current user', () => request
      .get('/api/users/me')
      .set('Cookie', `jwtMesto=${token}`)
      .then((res) => {
        message = JSON.parse(res.text);
        const userData = message.data;
        expect(res.status).toBe(200);
        expect(userData._id).toBe(userId);
      }));

    it('Get current user, auth error', () => request
      .get('/api/users/me')
      .set('Cookie', `jwtMesto=${invalidAuthToken}`)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
        expect(message.message).toBe(errorMessages.tokenError);
      }));
  });

  describe('Change user data', () => {
    it('Change user data: invalid data (email)', () => request
      .patch('/api/users/me')
      .set('Cookie', `jwtMesto=${token}`)
      .send(newUserInfoInvalidEmail)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        celebrateValidationTest(message, '"email" must be a valid email');
      }));

    it('Change user data: invalid data (name)', () => request
      .patch('/api/users/me')
      .set('Cookie', `jwtMesto=${token}`)
      .send(newUserInfoInvalidName)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(400);
        celebrateValidationTest(message, '"name" is not allowed to be empty');
      }));

    it('Change user data: valid data', () => request
      .patch('/api/users/me')
      .set('Cookie', `jwtMesto=${token}`)
      .send(newUserInfo)
      .then((res) => {
        message = JSON.parse(res.text);
        const userData = message.data;
        expect(res.status).toBe(200);
        expect({ name: userData.name, email: userData.email }).toEqual(newUserInfo);
      }));

    it('Change user data: valid data, auth error', () => request
      .patch('/api/users/me')
      .set('Cookie', `jwtMesto=${invalidAuthToken}`)
      .send(newUserInfo)
      .then((res) => {
        message = JSON.parse(res.text);
        expect(res.status).toBe(401);
        expect(message.message).toEqual(errorMessages.tokenError);
      }));
  });

  describe('Remove test-user, check login', () => {
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

    // remove test user
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
      request.get('/api/users/me/abc/def//', (res) => {
        expect(res.status).toBe(404);
      });
    });

    it('Check invalid url or method, example 2', () => {
      request.get('/api/users/e/aaa/xxx/123', (res) => {
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
