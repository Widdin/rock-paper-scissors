import winston from 'winston';
import expressWinston from 'express-winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
  format: winston.format.combine(winston.format.json())
});

const expressLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'logs/http.log' })],
  format: winston.format.combine(winston.format.json()),
  meta: true,
  dynamicMeta: function (req) {
    return {
      body: req.body
    };
  },
  responseWhitelist: ['body'],
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  colorize: true,
  ignoreRoute: function () {
    return false;
  }
});

export { logger, expressLogger };
