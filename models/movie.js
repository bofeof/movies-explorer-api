const mongoose = require('mongoose');
const errorMessages = require('../utils/errorMessages');

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
    required: true,
    validate: {
      validator(url) {
        return /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(url);
      },
      message: errorMessages.invalidUrl,
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(url);
      },
      message: errorMessages.invalidUrl,
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return /^(http|https)\W+[w]{0,3}\S*[#]*$/gi.test(url);
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
    type: Number,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movies', movieSchema);
