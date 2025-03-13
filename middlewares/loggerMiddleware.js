// middleware/loggerMiddleware.js

import logger from '../config/logger.js';

const loggerMiddleware = (req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next(); // Proceed to the next middleware or route handler
};

export default loggerMiddleware;
