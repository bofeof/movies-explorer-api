const userRouter = require('express').Router();
const { updateUserValidation } = require('../utils/celebrateValidation');

// import controllers
const { getUser, updateUser } = require('../controllers/users');

// users/me
userRouter.get('/me', getUser);

userRouter.patch(
  '/me',
  updateUserValidation,
  updateUser,
);

module.exports = userRouter;
