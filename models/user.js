const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../utils/errorHandler/UnauthorizedError');
const errorMessages = require('../utils/errorMessages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: errorMessages.invalidEmail,
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.index({ email: 1 }, { unique: true });

// for login needs
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError({ message: errorMessages.wrongEmailPassword }));
      }

      // user exists, password check
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError({ message: errorMessages.wrongEmailPassword }),
          );
        }
        // user exists, password is correct
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
