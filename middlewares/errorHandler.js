import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`); // Log the error message

  // Send a response to the client
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
