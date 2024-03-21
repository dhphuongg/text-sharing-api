const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { messageConstant } = require("../constants");

const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = pick(req.body, [
    "oldPassword",
    "newPassword",
  ]);
  if (!(await bcrypt.compare(oldPassword, req.auth.password))) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.password.incorrect)
    );
  }
  await userService.updatePasswordById(req.auth.id, newPassword);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: messageConstant.password.changeSuccess,
    error: null,
  });
});

module.exports = { changePassword };
