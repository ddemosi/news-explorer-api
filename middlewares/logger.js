// middlewares/logger.js

const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');
const path = require('path');

const logDir = './logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, '/request.log') }),
  ],
  format: winston.format.json(),
});

// error logger
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
