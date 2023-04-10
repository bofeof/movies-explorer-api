const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorMessages = require('../utils/errorMessages');

const { developmentEnvConstants } = require('../utils/developmentEnvConstants');

const { DublicateDataError } = require('../utils/errorHandler/DublicateDataError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

module.exports.getUser = (req, res, next) => {
  const currentUserId = req.user._id;
  User.findById(currentUserId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // check 11000, user already exists
      if (err.code === 11000) {
        next(
          new DublicateDataError({
            message: errorMessages.changeEmailError,
          }),
        );
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    ...req.body,
    password: hash,
  })
    .then((user) => {
      User.findById(user._id)
        .then((newUser) => {
          res.send({ data: newUser });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      // check 11000, user already exists
      if (err.code === 11000) {
        next(
          new DublicateDataError({
            message: errorMessages.userExistsError,
          }),
        );
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    }));
};

module.exports.signInUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : developmentEnvConstants.JWT_SECRET,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwtMovies', token, {
          httpOnly: process.env.NODE_ENV === 'production',
          sameSite: 'none',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000 * 24 * 7,
        })
        .json({ message: 'Пользователь зашел в аккаунт' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.signOut = (req, res) => res
  .clearCookie('jwtMovies', {
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  })
  .json({ message: 'Пользователь вышел из аккаунта' });
