const httpStatus = require("http-status");
const { Prisma } = require("@prisma/client");
const multer = require("multer");

const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const logger = require("../config/winston.config");
const { messageConstant, constants } = require("../constants");
const destroyFileByPath = require("../utils/destroyFile");

const handlePrismaError = (err) => {
  switch (err.code) {
    case "P2002":
      return new ApiError(
        httpStatus.BAD_REQUEST,
        `Duplicate field value: ${err.meta.target}`
      );
    case "P2014":
      return new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid ID: ${err.meta.target}`
      );
    case "P2003":
      return new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid input data: ${err.meta.target}`
      );
    default:
      return new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Something went wrong: ${err.message}`
      );
  }
};

const multerErrorMessages = {
  LIMIT_PART_COUNT: "Too many parts",
  LIMIT_FILE_SIZE: "File too large",
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_FIELD_KEY: "Field name too long",
  LIMIT_FIELD_VALUE: "Field value too long",
  LIMIT_FIELD_COUNT: "Too many fields",
  LIMIT_UNEXPECTED_FILE: "Unexpected field",
  MISSING_FIELD_NAME: "Field name missing",
};

const handleMulterError = (err) => {
  console.log(err);
  return new ApiError(httpStatus.BAD_REQUEST, multerErrorMessages[err.code]);
};

const errorConverter = async (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    err = handleMulterError(err);
  }
  if (req.file && req.file.path) {
    await destroyFileByPath(req.file.path);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    err = handlePrismaError(err);
  } else if (err.name === "JsonWebTokenError") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.invalid)
    );
  } else if (err.name === "TokenExpiredError") {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.expired)
    );
  } else if (err instanceof ApiError) return next(err);
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

  if (config.server.env === constants.mode.development) {
    console.log(err);
    logger.error(err, { label: "error-handler" });
  }

  res.status(status).json({
    code: status,
    message: messageConstant.responseStatus.error,
    data: null,
    error,
    ...(config.server.env === constants.mode.development && {
      stack: err.stack,
    }),
  });
};

module.exports = { errorConverter, errorHandler };
