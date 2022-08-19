const winston = require('winston');
require('winston-daily-rotate-file');

const colorizer = winston.format.colorize();

module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.prettyPrint((msg) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)),
  ),
  transports: [

    new winston.transports.DailyRotateFile({
      filename: './backend/log/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '0.1m',
      maxFiles: '4',
    }),

  ],
});
