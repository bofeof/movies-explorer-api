const { NotFoundError } = require('./NotFoundError');
const errorMessages = require('../errorMessages');

module.exports.wrongRouteErrorHandler = (req, res, next) => {
  next(
    new NotFoundError({
      message: errorMessages.routeError,
    }),
  );
};
