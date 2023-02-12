const rateLimit = require('express-rate-limit');

const requestLimitOptions = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000, // 2000 reqs per 5 min
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = requestLimitOptions;
