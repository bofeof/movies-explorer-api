const Movie = require('../models/movie');
const errorMessages = require('../utils/constants');
const { ForbiddenError } = require('../utils/errorHandler/ForbiddenError');

// /movies
module.exports.getMovies = (req, res, next) => {
  const currentUserId = req.user._id;
  Movie.find({ owner: currentUserId })
    .populate('owner')
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

// /movies
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const movieData = { ...req.body, owner };
  Movie.create(movieData)
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

// /movies/:id
module.exports.deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {movieId} = req.params;

  //  find movie by id
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError({ message: errorMessages.removingMovieError }));
        return;
      }

      // movie exists
      const ownerMovieId = movie.owner._id.toString();
      // check permission
      if (ownerId !== ownerMovieId) {
        next(new ForbiddenError({ message: errorMessages.forbiddenError }));
        return;
      }

      // removing
      Movie.findByIdAndRemove(movieId, (err, removingMovie) => {
        if (err) {
          next(err);
          return;
        }
        res.send({ data: removingMovie });
      }).populate('owner');
    })
    .catch((err) => next(err));
};
