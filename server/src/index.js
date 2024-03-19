const { PrismaClient } = require("@prisma/client");

const app = require("./app");
const config = require("./config/config");
const logger = require("./config/winston.config");
const { messageConstant, constants } = require("./constants");

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(async () => {
    logger.info(messageConstant.database.connectSuccess);
    if ((await prisma.user.count()) === 0) {
      const admin = await prisma.user.create({
        data: { ...config.admin, role: constants.role.admin },
      });
    }
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

module.exports = prisma;
