const corsOption = {
  origin: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

module.exports = corsOption;
