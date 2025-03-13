import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({
        filename: path.join(process.cwd(), 'log-files', 'error.txt'), // Use process.cwd() to get the current working directory
        level: 'error', // Only log errors to this file
    }),
    new winston.transports.File({
        filename: path.join(process.cwd(), 'log-files', 'info.txt'), // Use process.cwd() to get the current working directory
        level: 'info', // Only log info to this file
    }),
  ],
});

// Optional: Log unhandled exceptions and rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: 'exceptions.log' })
);

logger.rejections.handle(
  new winston.transports.File({ filename: 'rejections.log' })
);

export default logger;
