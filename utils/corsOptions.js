const corsOption = {
  // origin: ['http://localhost:3000', 'http://localhost:3005']
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

module.exports = corsOption;
