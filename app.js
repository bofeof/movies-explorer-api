require('dotenv').config({ path: '../.env' });

const { MONGO_URL, MONGO_DB } = process.env;

const express = require('express');
const mongoose = require('mongoose');

// validation
const { errors } = require('celebrate');

// request settings
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

// middlewares
const { requestLogger, errorLogger } = require('./middlewares/logger');

// routes
const apiRouter = require('./routes/index');

// error-handlers
const errorMessages = require('./utils/errorMessages');
const { NotFoundError } = require('./utils/errorHandler/NotFoundError');
const { centalizedErrorHandler } = require('./utils/errorHandler/centralizedErrorHandler');

// request settings before start:
const requestLimitOptions = require('./utils/requestLimitOptions');
const corsOption = require('./utils/corsOptions');

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, () => {
  // eslint-disable-next-line no-console
  console.log(`Connected to MongoDB. Database: ${MONGO_DB}`);
});

// request settings
app.use(cors(corsOption));
app.use(requestLogger);
app.use(requestLimitOptions);
app.use(helmet());

// Body-parser for body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api', apiRouter);

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

app.use(centalizedErrorHandler);

module.exports = app;
