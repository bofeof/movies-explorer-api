// validation
const { celebrate, Joi } = require('celebrate');

const apiRouter = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');

// controllers: action for users
const { signInUser, createUser } = require('../controllers/users');

// middlewares
const auth = require('../middlewares/auth');

apiRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(1),
    }),
  }),
  signInUser,
);

apiRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(1),
    }),
  }),
  createUser,
);

// protected by auth
apiRouter.use('/users', auth, userRouter);
apiRouter.use('/movies', auth, moviesRouter);

// tmp crash-test(for deployment) for database and error-handler
apiRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server goes down');
  }, 0);
});

module.exports = apiRouter;
