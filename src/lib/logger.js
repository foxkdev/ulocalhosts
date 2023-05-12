const winston = require('winston');
const { format, transports } = require('winston');

const logger = winston.createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [new transports.Console()],
});

export default logger;