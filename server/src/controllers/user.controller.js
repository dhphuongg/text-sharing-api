const bcrypt = require('bcrypt');
const httpStatus = require('http-status');

const { userService, followService, notificationService, socketService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { getOptions } = require('../utils/getPaginationAndSort');
const destroyFileByPath = require('../utils/destroyFile');
const ApiError = require('../utils/ApiError');
const { messageConstant } = require('../constants');

const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = pick(req.body, ['oldPassword', 'newPassword']);
  if (!(await bcrypt.compare(oldPassword, req.auth.password))) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, messageConstant.password.incorrect));
  }
  await userService.updatePasswordById(req.auth.id, newPassword);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: messageConstant.password.changeSuccess,
    error: null
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const data = pick(req.body, ['fullName', 'username', 'birthday', 'bio']);
  if (req.file) {
    data.avatar = req.file.path.replace(/\\/g, '/');
    req.auth.avatar && (await destroyFileByPath(req.auth.avatar));
  }

  const user = await userService.updateById(req.auth.id, data);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null
  });
});

const getById = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  const user = await userService.getById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound('User')));
  }
  user.friendshipStatus = await followService.getFriendshipStatus(req.auth.id, user.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getById(req.auth.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null
  });
});

const follow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  if (req.auth.id === userId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, messageConstant.follow.selfFollow));
  } else if (await followService.getById(req.auth.id, userId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, messageConstant.already('Follow')));
  }
  const follow = await followService.createById(req.auth.id, userId);
  const notifications = await notificationService.createNotification(req.auth.id, userId);
  socketService.emit(
    `notifications-${userId}`,
    `${follow.followBy.username} ${messageConstant.notifyContent[notifications.event]}`
  );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: follow,
    error: null
  });
});

const unfollow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  if (req.auth.id === userId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, messageConstant.follow.selfUnfollow));
  } else if (!(await followService.getById(req.auth.id, userId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, messageConstant.notFound('Follow')));
  }
  const follow = await followService.deleteById(req.auth.id, userId);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: null,
    error: null
  });
});

const getFollowersById = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  const { limit, page } = getOptions(req.query);
  const { users, total } = await followService.getFollowersById(userId, {
    limit,
    page
  });
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.friendshipStatus = await followService.getFriendshipStatus(req.auth.id, user.id);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { users, limit, page, total },
    error: null
  });
});

const getFollowingById = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  const { limit, page } = getOptions(req.query);
  const { users, total } = await followService.getFollowingById(userId, {
    limit,
    page
  });
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.friendshipStatus = await followService.getFriendshipStatus(req.auth.id, user.id);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { users, limit, page, total },
    error: null
  });
});

const search = catchAsync(async (req, res, next) => {
  const { limit, page, keyword } = getOptions(req.query);
  const { users, total } = await userService.search({ limit, page, keyword });
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.friendshipStatus = await followService.getFriendshipStatus(req.auth?.id, user.id);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { users, limit, page, total, keyword },
    error: null
  });
});

module.exports = {
  getById,
  getProfile,
  changePassword,
  updateProfile,
  follow,
  unfollow,
  getFollowersById,
  getFollowingById,
  search
};
