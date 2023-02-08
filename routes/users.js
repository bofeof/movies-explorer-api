const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

// import controllers
const { getUser, updateUser } = require('../controllers/users');

// users/me
userRouter.get('/me', getUser);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

module.exports = userRouter;
