const apiRouter = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');

const { wrongRouteErrorHandler } = require('../utils/errorHandler/wrongRouteErrorHandler');

const { signInUser, createUser } = require('../controllers/users');

const { signinValidation, signupValidation } = require('../utils/celebrateValidation');

const auth = require('../middlewares/auth');

apiRouter.post(
  '/signin',
  signinValidation,
  signInUser,
);

apiRouter.post(
  '/signup',
  signupValidation,
  createUser,
);

apiRouter.use('/users', auth, userRouter);
apiRouter.use('/movies', auth, moviesRouter);
apiRouter.use('/', auth, wrongRouteErrorHandler);

// crash-test for database and error-handler
apiRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server goes down');
  }, 0);
});

module.exports = apiRouter;
