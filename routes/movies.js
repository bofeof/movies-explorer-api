const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const moviesRouter = require('express').Router();

moviesRouter.get('/', getMovies);

moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().uri(),
      trailerLink: Joi.string().required().uri(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      movieId: Joi.string().required(),
    }),
  }),
  createMovie
);

moviesRouter.delete('/:movieId',
celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  })
}),
deleteMovie);

module.exports = moviesRouter;
