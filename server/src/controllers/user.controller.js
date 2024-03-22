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
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null,
  });
});

const getById = catchAsync(async (req, res, next) => {
  const { id } = pick(req.params, ["id"]);
  const user = await userService.getById(id);
  if (req.auth) {
    user.friendshipStatus = {
      following: user.followers.some((f) => f.followById === req.auth.id),
      followedBy: req.auth.followers.some((f) => f.followById === user.id),
    };
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null,
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getById(req.auth.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null,
  });
});

module.exports = { changePassword, updateProfile, getById, getProfile };
