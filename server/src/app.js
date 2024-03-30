const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { xss } = require('express-xss-sanitizer');
const path = require('path');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const morgan = require('./config/morgan.config');
const { errorConverter, errorHandler } = require('./middlewares').error;
const router = require('./routes/v1');
const { messageConstant, constants } = require('./constants');
const ApiError = require('./utils/ApiError');
const { authSocket, i18nInit } = require('./middlewares');
const { socketService } = require('./services');
const LocaleKey = require('./locales/key.locale');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: 'websocket'
});
global._io = io;

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
app.use(helmet({ crossOriginResourcePolicy: false }));
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

// expose cookies to req.cookies
app.use(cookieParser());

// use i18n
app.use(i18nInit);

// health check
app.get('/~', (req, res) => res.json({ status: httpStatus.OK, message: _t(LocaleKey.HEALTHY) }));
// api v1 routes
app.use('/api/v1', router);
// api not found
app.all('*', (req, res, next) => {
  return next(
    new ApiError(
      httpStatus.NOT_FOUND,
      messageConstant.notFound(`Api ${req.method} ${req.originalUrl}`)
    )
  );
});

_io.use(authSocket);
_io.on('connection', socketService.connection);

// Errors handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = httpServer;
