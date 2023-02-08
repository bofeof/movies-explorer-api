require('dotenv').config({ path: '../.env' });

const { MONGO_URL, MONGO_DB } = process.env;

const express = require('express');
const mongoose = require('mongoose');

// validation
const { errors, celebrate, Joi } = require('celebrate');

// request settings
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// middlewares
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// routes
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

// controllers: action for users
const { signInUser, createUser } = require('./controllers/users');

// error-classes
const { NotFoundError } = require('./utils/errorHandler/NotFoundError');
const errorMessages = require('./utils/constants');

// some settings before start:
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000, // 2000 reqs per 5 min
  standardHeaders: true,
  legacyHeaders: false,
});

const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, () => {
  // eslint-disable-next-line no-console
  console.log(`Connected to MongoDB. Database: ${MONGO_DB}`);
});

// request settings
app.use(cors(corsOption));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());

// Body-parser for body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// tmp crash-test(for deployment) for database and error-handler
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server goes down');
  }, 0);
});

// signin signup
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(1),
    }),
  }),
  signInUser,
);
app.post(
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

// another routes (protected by auth)
app.use('/users', auth, userRouter);
app.use('/movies', auth, moviesRouter);

app.use((req, res, next) => {
  next(
    new NotFoundError({
      message: errorMessages.routeError,
    }),
  );
});

app.use(errorLogger);
// celebrate-errs
app.use(errors());

// message for user about all errors
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

module.exports = app;
