// const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

// import controllers
const { getUser, updateUser } = require('../controllers/users');

// /users/...
// add joi validation
userRouter.get('/me', getUser);

userRouter.patch('/me', updateUser);

module.exports = userRouter;
