const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorMessages = require('../utils/constants');
const { DublicateDataError } = require('../utils/errorHandler/DublicateDataError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

// users/me
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

// users/me
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
        next(new DublicateDataError({
          message: errorMessages.userExistsError,
        }));
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
      // create jwt
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
