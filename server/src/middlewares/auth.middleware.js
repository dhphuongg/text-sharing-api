const httpStatus = require('http-status');

const { constants } = require('../constants');
const catchAsync = require('../utils/catchAsync');
const jwt = require('../utils/jwt');
const config = require('../config/config');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const LocaleKey = require('../locales/key.locale');

const bearer = 'Bearer';
const authorize = (roles = [constants.role.user]) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace(`${bearer} `, constants.emptyString);
    if (!token || !req.headers.authorization.startsWith(bearer)) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.REQUIRED, 'Token')));
    }

    const decoded = jwt.verifyToken(token, config.jwt.secret);
    const user = await userService.getFullById(decoded.sub);
    if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.TOKEN_INVALID)));
    if (user.role !== constants.role.admin && !roles.includes(user.role))
      return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.UNAUTHORIZED)));

    req.auth = user;
    return next();
  });

const authSocket = async (socket, next) => {
  try {
    // const token = socket.handshake.auth.token;
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.REQUIRED, 'Token')));
    }
    const decoded = jwt.verifyToken(token, config.jwt.secret);
    const user = await userService.getFullById(decoded.sub);
    if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.TOKEN_INVALID)));

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { authorize, authSocket };
