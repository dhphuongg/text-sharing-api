const logger = require('../config/winston.config');

const connection = (socket) => {
  logger.info(`User ${socket.id} connected!`, { label: 'socket.io' });
  socket.on('disconnect', () => {
    logger.info(`User ${socket.id} disconnect!`, { label: 'socket.io' });
  });
};

const emit = (event, ...args) => {
  _io.emit(event, ...args);
};

module.exports = { connection, emit };
