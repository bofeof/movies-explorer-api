const mongoose = require('mongoose');
const validator = require('validator');
const errorMessages = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'John Galt',
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
  password: {
    type: String,
    required: true,
    select: false
  }
  },
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('user', userSchema)