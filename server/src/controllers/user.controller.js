const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const destroyFileByPath = require("../utils/destroyFile");
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

const updateProfile = catchAsync(async (req, res, next) => {
  const data = pick(req.body, ["fullName", "username", "birthday", "bio"]);
  if (req.file) {
    data.avatar = req.file.path.replace(/\\/g, "/");
    req.auth.avatar && (await destroyFileByPath(req.auth.avatar));
  }

  const user = await userService.updateById(req.auth.id, data);
  delete user.password;
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null,
  });
});

module.exports = { changePassword, updateProfile };
