require('dotenv').config({ path: '../.env' });

const express = require('express');

// validation
const { errors } = require('celebrate');

// request settings
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

// middlewares logger
const { requestLogger, errorLogger } = require('./middlewares/logger');

// routes
const apiRouter = require('./routes/index');

// error-handlers
const { centalizedErrorHandler } = require('./utils/errorHandler/centralizedErrorHandler');
const { uncaughtExceptionHandler } = require('./utils/errorHandler/uncaughtExceptionHandler');

// request settings before start:
const requestLimitOptions = require('./utils/requestLimitOptions');
const corsOption = require('./utils/corsOptions');

const app = express();

process.on('uncaughtException', uncaughtExceptionHandler);

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

app.use(errorLogger);

// celebrate-errs
app.use(errors());

app.use(centalizedErrorHandler);

module.exports = app;
