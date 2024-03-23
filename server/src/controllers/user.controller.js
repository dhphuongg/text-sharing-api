const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

const { userService, followService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { getOptions } = require("../utils/getPaginationAndSort");
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
  if (!user) {
    return next(
      new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("User"))
    );
  }
  user.friendshipStatus = null;
  if (req.auth && req.auth.id !== id) {
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

const getFollowersById = catchAsync(async (req, res, next) => {
  const { id } = pick(req.params, ["id"]);
  const { limit, page, sortBy } = getOptions(req.query);
  const { followers, total } = await followService.getFollowersById(id, {
    limit,
    page,
    sortBy,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: {
      users: followers.map((follower) => {
        let friendshipStatus = null;
        if (follower.followBy.id !== req.auth.id) {
          friendshipStatus = {
            followedBy: req.auth.followers.some(
              (f) => f.followById === follower.followBy.id
            ),
            following: follower.followBy.followers.some(
              (f) => f.followById === req.auth.id
            ),
          };
        }
        return {
          ...follower.followBy,
          friendshipStatus,
        };
      }),
      limit,
      page,
      total,
      sortBy,
    },
    error: null,
  });
});

module.exports = {
  getById,
  getProfile,
  getFollowersById,
  changePassword,
  updateProfile,
};
