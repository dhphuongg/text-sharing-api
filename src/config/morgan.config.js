const morgan = require('morgan');

const config = require('./config');
const logger = require('./winston.config');
const { constants } = require('../constants');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () =>
  config.server.env === constants.mode.development ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: {
    write: (message) => logger.info(message.trim(), { label: 'morgan' })
  }
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => logger.error(message.trim(), { label: 'morgan' })
  }
});

module.exports = {
  successHandler,
  errorHandler
};
