const bcrypt = require("bcrypt");

const prisma = require("./prisma-client");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/winston.config");
const { messageConstant, constants } = require("./constants");

prisma
  .$connect()
  .then(async () => {
    logger.info(messageConstant.database.connectSuccess);
    app.listen(config.server.port, () => {
      logger.info(
        `✨ ${config.server.name} is running at http://localhost:${config.server.port}`
      );
    });
  })
  .catch((error) => {
    logger.error(messageConstant.database.connectFail);
    logger.error(error);
  });
