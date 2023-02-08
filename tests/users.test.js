require('dotenv').config();
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const { MONGO_URL, MONGO_DB } = process.env;
const errorMessages = require('../utils/constants');

const {
  newUser,
  invalidNewUser,
  currentUser,
  currentUserInvalid,
  newUserInfo,
  newUserInfoInvalidEmail,
  newUserInfoInvalidName,
} = require('./fixtures/testUserData');

let token;
let userId;
let message;

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

describe('Testing user-requests', () => {
  describe('Sign up', () => {
    it('Signup: сreate user with invalid data', () =>
      request
        .post('/signup')
        .send(invalidNewUser)
        .then((res) => {
          message = JSON.parse(res.text);
          expect(res.status).toBe(400);
          celebrateValidationTest(message, '"email" must be a valid email');
        }));

    it('Signup: сreate user with valid data, user doesnt exist', () =>
      request
        .post('/signup')
        .send(newUser)
        .then((res) => {
          const message = JSON.parse(res.text);
          const userData = message.data;
          userId = userData._id;
          expect(res.status).toBe(200);
          expect(message).toBeDefined();
          expect(userData._id).toBeDefined();
          expect(userData.email).toContain(newUser.email);
        }));

    it('Signup: сreate user with valid data again, user already exists', () =>
      request
        .post('/signup')
        .send(newUser)
        .then((res) => {
          const message = JSON.parse(res.text);
          expect(res.status).toBe(409);
          expect(message.message).toBe(errorMessages.userExistsError);
        }));
  });

  describe('Sign in', () => {
    it('Signin: login with invalid data', () =>
      request
        .post('/signin')
        .send(currentUserInvalid)
        .then((res) => {
          message = JSON.parse(res.text);
          expect(res.status).toBe(400);
          celebrateValidationTest(message, '"email" must be a valid email');
        }));

    it('Signin: login with valid data', () =>
      request
        .post('/signin')
        .send(currentUser)
        .then((res) => {
          message = JSON.parse(res.text);
          token = `Bearer ${message.token}`;
          expect(res.status).toBe(200);
          expect(token).toBeDefined();
        }));

    it('Get current user', () =>
      request
        .get('/users/me')
        .set('Authorization', token)
        .then((res) => {
          message = JSON.parse(res.text);
          const userData = message.data;
          expect(res.status).toBe(200);
          expect(userData._id).toBe(userId);
        }));
  });

  describe('Change user data', () => {
    it('Change user data: invalid data (email)', () =>
      request
        .patch('/users/me')
        .set('Authorization', token)
        .send(newUserInfoInvalidEmail)
        .then((res) => {
          message = JSON.parse(res.text);
          expect(res.status).toBe(400);
          celebrateValidationTest(message, '"email" must be a valid email');
        }));

    it('Change user data: invalid data (name)', () =>
      request
        .patch('/users/me')
        .set('Authorization', token)
        .send(newUserInfoInvalidName)
        .then((res) => {
          message = JSON.parse(res.text);
          expect(res.status).toBe(400);
          celebrateValidationTest(message, '"name" is not allowed to be empty');
        }));

    it('Change user data: valid data', () =>
      request
        .patch('/users/me')
        .set('Authorization', token)
        .send(newUserInfo)
        .then((res) => {
          message = JSON.parse(res.text);
          const userData = message.data;
          expect(res.status).toBe(200);
          expect({name: userData.name, email: userData.email}).toEqual(newUserInfo)
        }));
  });

  describe('Remove test-user, check login', () => {
    it('User already exists, user cant sign up', () =>
      request
        .post('/signup')
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
    it('User doesnt exist', () =>
      request
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
});
