require('dotenv').config();

const {
  NODE_ENV = 'development',
  MONGO_URL_PROD,
  MONGO_DB_PROD,
  PORT_PROD,
} = process.env;

const mongoose = require('mongoose');
const console = require('console');
const { developmentEnvConstants } = require('./utils/developmentEnvConstants');

const myConsole = new console.Console(process.stdout, process.stderr);

const app = require('./app');

const PORT = NODE_ENV === 'production' ? PORT_PROD : developmentEnvConstants.PORT;
const MONGO_URL = NODE_ENV === 'production' ? MONGO_URL_PROD : developmentEnvConstants.MONGO_URL;
const MONGO_DB = NODE_ENV === 'production' ? MONGO_DB_PROD : developmentEnvConstants.MONGO_DB;

mongoose.set('strictQuery', true);
mongoose.connect(`${MONGO_URL}/${MONGO_DB}`, () => {
  myConsole.log(`Connected to MongoDB. Database: ${MONGO_DB}`);
});

app.listen(PORT, () => {
  myConsole.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
