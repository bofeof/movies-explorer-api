const moviesRouter = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../utils/celebrateValidation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.post(
  '/',
  createMovieValidation,
  createMovie,
);

moviesRouter.delete(
  '/:movieId',
  deleteMovieValidation,
  deleteMovie,
);

module.exports = moviesRouter;
