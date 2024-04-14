const bcrypt = require('bcrypt');
const httpStatus = require('http-status');

const { userService, followService, notificationService, socketService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { getOptions } = require('../utils/getPaginationAndSort');
const destroyFileByPath = require('../utils/destroyFile');
const ApiError = require('../utils/ApiError');
const { constants } = require('../constants');
const LocaleKey = require('../locales/key.locale');

const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = pick(req.body, ['oldPassword', 'newPassword']);
  if (!(await bcrypt.compare(oldPassword, req.auth.password))) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.PASSWORD_INCORRECT)));
  }
  await userService.updatePasswordById(req.auth.id, newPassword);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: _t(LocaleKey.PASSWORD_CHANGE_SUCCESS),
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
    message: constants.message.success,
    data: user,
    error: null
  });
});

const getById = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  const user = await userService.getById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.USER))));
  }
  user.friendshipStatus = await followService.getFriendshipStatus(req.auth.id, user.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: user,
    error: null
  });
});

const getByUsername = catchAsync(async (req, res, next) => {
  const { username } = pick(req.params, ['username']);
  const user = await userService.getByUsername(username);
  if (!user) {
    return next(new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.USER))));
  }
  user.friendshipStatus = await followService.getFriendshipStatus(req.auth?.id, user.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: user,
    error: null
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  const user = await userService.getById(req.auth.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: user,
    error: null
  });
});

const follow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  if (req.auth.id === userId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.SELF_FOLLOW)));
  } else if (await followService.getById(req.auth.id, userId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.FOLLOW_ALREADY)));
  }
  const follow = await followService.createById(req.auth.id, userId);
  await notificationService.createNotification(req.auth.id, userId);
  socketService.emit(
    `notifications-${userId}`,
    `${follow.followBy.username} ${_t(LocaleKey.NOTIFICATION_FOLLOW)}`
  );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: _t(LocaleKey.FOLLOW_SUCCESS),
    error: null
  });
});

const unfollow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  if (req.auth.id === userId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.SELF_UNFOLLOW)));
  } else if (!(await followService.getById(req.auth.id, userId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.UNFOLLOW_FAILED)));
  }
  const follow = await followService.deleteById(req.auth.id, userId);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: _t(LocaleKey.UNFOLLOW_SUCCESS),
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
    message: constants.message.success,
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
    message: constants.message.success,
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
    message: constants.message.success,
    data: { users, limit, page, total, keyword },
    error: null
  });
});

module.exports = {
  getById,
  getByUsername,
  getProfile,
  changePassword,
  updateProfile,
  follow,
  unfollow,
  getFollowersById,
  getFollowingById,
  search
};
