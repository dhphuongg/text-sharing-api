const httpStatus = require("http-status");

const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const logger = require("../config/winston.config");
const { messageConstant, constants } = require("../constants");

const errorConverter = (err, req, res, next) => {
  if (err instanceof ApiError) return next(err);
  if (err.name === "JsonWebTokenError") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.invalid)
    );
  }
  if (err.name === "TokenExpiredError") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.expired)
    );
  }
  return next(
    new ApiError(
      err.status || httpStatus.INTERNAL_SERVER_ERROR,
      err.message,
      false,
      err.stack
    )
  );
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const error = err.message || messageConstant.sthWrong;

  if (config.env === constants.mode.development) {
    console.log(err);
    logger.error(err, { label: "error-handler" });
  }

  res.status(status).json({
    code: status,
    message: messageConstant.responseStatus.error,
    data: null,
    error,
    ...(config.app.env === constants.mode.development && { stack: err.stack }),
  });
};

module.exports = { errorConverter, errorHandler };
