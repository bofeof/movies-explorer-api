const Movie = require('../models/movie');

const errorMessages = require('../utils/errorMessages');

const { ForbiddenError } = require('../utils/errorHandler/ForbiddenError');
const { NotFoundError } = require('../utils/errorHandler/NotFoundError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

module.exports.getMovies = (req, res, next) => {
  const currentUserId = req.user._id;
  Movie.find({ owner: currentUserId })
    .populate('owner')
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const movieData = { ...req.body, owner };
  Movie.create(movieData)
    .then((movie) => Movie.findById(movie._id)
      .populate('owner')
      .then((data) => {
        if (!data) {
          next(new NotFoundError({ message: errorMessages.movieIdError }));
        }
        res.send({ data });
      })
      .catch((err) => {
        next(err);
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then(async (movie) => {
      if (!movie) {
        next(new NotFoundError({ message: errorMessages.removingMovieError }));
        return;
      }

      const ownerMovieId = movie.owner._id.toString();
      if (ownerId !== ownerMovieId) {
        next(new ForbiddenError({ message: errorMessages.forbiddenError }));
        return;
      }

      try {
        const removingMovie = await Movie.findByIdAndRemove(movieId).populate('owner');
        res.send({ data: removingMovie });
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => next(err));
};
