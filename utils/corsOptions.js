const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

module.exports = corsOption;
