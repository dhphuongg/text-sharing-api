const app = require("./app");
const config = require("./config/config");
const logger = require("./config/winston.config");

app.listen(config.server.port, () => {
  logger.info(
    `✨ ${config.server.name} is running at http://localhost:${config.server.port}`
  );
});
