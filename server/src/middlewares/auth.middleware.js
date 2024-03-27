const httpStatus = require("http-status");

const { constants, messageConstant } = require("../constants");
const catchAsync = require("../utils/catchAsync");
const jwt = require("../utils/jwt");
const config = require("../config/config");
const { userService } = require("../services");
const ApiError = require("../utils/ApiError");

const bearer = "Bearer";
const authorize = (roles = [constants.role.user]) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace(
      `${bearer} `,
      constants.emptyString
    );
    if (!token || !req.headers.authorization.startsWith(bearer)) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.required("Token"))
      );
    }

    const decoded = jwt.verifyToken(token, config.jwt.secret);
    const user = await userService.getFullById(decoded.sub);
    if (!user)
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.invalid)
      );
    if (user.role !== constants.role.admin && !roles.includes(user.role))
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized)
      );

    req.auth = user;
    return next();
  });

module.exports = authorize;
