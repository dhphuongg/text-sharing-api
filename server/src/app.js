const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { xss } = require("express-xss-sanitizer");
const path = require("path");
const httpStatus = require("http-status");

const config = require("./config/config");
const morgan = require("./config/morgan.config");
const { errorConverter, errorHandler } = require("./middlewares").error;
const router = require("./routes/v1");
const { messageConstant, constants } = require("./constants");
const ApiError = require("./utils/ApiError");

const app = express();

// morgan
if (config.server.env !== constants.mode.test) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// gzip compression
app.use(compression());
// enable cors
app.use(cors());
// set security HTTP headers
app.use(helmet());
app.use(xss());
// file static
app.use(
  `/${constants.uploadDirectory}`,
  express.static(path.join(__dirname, `../${constants.uploadDirectory}`))
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// parse json request body
app.use(express.json());

// health check
app.get("/~", (req, res) =>
  res.json({ status: httpStatus.OK, message: messageConstant.healthy })
);
// api v1 routes
app.use("/api/v1", router);
// api not found
app.all("*", (req, res, next) => {
  return next(
    new ApiError(
      httpStatus.NOT_FOUND,
      messageConstant.notFound(`Api ${req.method} ${req.originalUrl}`)
    )
  );
});

// Errors handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
