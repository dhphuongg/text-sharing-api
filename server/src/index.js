const bcrypt = require('bcrypt');

const prisma = require('./prisma-client');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/winston.config');

prisma
  .$connect()
  .then(async () => {
    logger.info('✅ MySQL Database is connected');
    app.listen(config.server.port, () => {
      logger.info(`✨ ${config.server.name} is running at http://localhost:${config.server.port}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Connect to MySQL Database is failed');
    logger.error(error);
  });
