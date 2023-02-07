require('dotenv').config();

const app = require('./app');

const { PORT = 3000, NODE_ENV = 'development' } = process.env;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}. Environment: ${NODE_ENV}`);
});
