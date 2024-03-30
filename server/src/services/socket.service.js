const logger = require('../config/winston.config');

const connection = (socket) => {
  logger.info('Connected socket', { label: 'socket.io' });
  socket.on('disconnect', () => {
    logger.info(`User disconnect id is ${socket.id}`, { label: 'socket.io' });
  });
};

const emit = (event, ...args) => {
  _io.emit(event, ...args);
};

module.exports = { connection, emit };
