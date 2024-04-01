const fs = require('fs');
const path = require('path');

const logger = require('../config/winston.config');

const destroyFileByPath = async (_path) => {
  const filePath = path.join(__dirname, '../../', _path);
  fs.exists(filePath, (exists) => {
    if (exists) {
      fs.unlink(filePath, (err) => {
        if (err) {
          logger.error(err);
        } else {
          logger.info(`File '${filePath}' đã được xóa!`);
        }
      });
    } else {
      logger.info(`File: '${filePath}' không tồn tại!`);
    }
  });
};

module.exports = destroyFileByPath;
