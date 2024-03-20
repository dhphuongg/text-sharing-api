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
    if ((await prisma.user.count()) === 0) {
      await prisma.otp.create({
        data: {
          email: config.admin.email,
          otp: 0,
          deletedAt: new Date(),
        },
      });
      const admin = await prisma.user.create({
        data: {
          ...config.admin,
          role: constants.role.admin,
          password: bcrypt.hashSync(
            config.admin.password,
            constants.bcryptSalt
          ),
        },
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
