const mongoose = require('mongoose');
const validator = require('validator');
const errorMessages = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    validator: {
      validation(url) {
        return (
          validator.isUrl(url, { require_protocol: true }) &&
          /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(value)
        );
      },
      message: errorMessages.invalidUrl,
    },
  },

  trailerLink: {
    type: String,
    validator: {
      validation(url) {
        return (
          validator.isUrl(url, { require_protocol: true }) &&
          /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(value)
        );
      },
      message: errorMessages.invalidUrl,
    },
  },

  thumbnail: {
    type: String,
    validator: {
      validation(url) {
        return (
          validator.isUrl(url, { require_protocol: true }) &&
          /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(value)
        );
      },
      message: errorMessages.invalidUrl,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  // id form MoviesExplorer-request
  movieId: {
    type: String,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
    validator: {
      validate(value) {
        return validator.isAlpha(value, 'ru-RU');
      },
      message: `${errorMessages.invalidLanguage}. Only Russian is allowed.`,
    },
  },

  nameEN: {
    type: String,
    required: true,
    validator: {
      validate(value) {
        return (
          validator.isAlpha(value, 'en-AU') ||
          validator.isAlpha(value, 'en-GB') ||
          validator.isAlpha(value, 'en-HK') ||
          validator.isAlpha(value, 'en-IN') ||
          validator.isAlpha(value, 'en-NZ') ||
          validator.isAlpha(value, 'en-US') ||
          validator.isAlpha(value, 'en-ZA') ||
          validator.isAlpha(value, 'en-ZM')
        );
      },
      message: `${errorMessages.invalidLanguage}. Only English is allowed.`,
    },
  },
});
