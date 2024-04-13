const httpStatus = require('http-status');

const {
  postService,
  postMediaService,
  reactionService,
  followService,
  notificationService,
  socketService
} = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { validationConstant, constants } = require('../constants');
const ApiError = require('../utils/ApiError');
const destroyFileByPath = require('../utils/destroyFile');
const { getOptions } = require('../utils/getPaginationAndSort');
const { addFriendshipStatusForPostAuthor } = require('../utils/friendshipStatus');
const LocaleKey = require('../locales/key.locale');

const createNewPost = catchAsync(async (req, res, next) => {
  const { content } = pick(req.body, ['content']);
  const myId = req.auth.id;
  if (!content && !req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.REQUIRED, 'Content or Media'));
  }
  const post = await postService.createPost(myId, content);
  // Create notification
  const followers = await followService.getAllFollowersById(myId);
  for (let i = 0; i < followers.length; i++) {
    await notificationService.createNotification(myId, followers[i].id, post.type, post.id);
    socketService.emit(
      `notifications-${followers[i].id}`,
      `${req.auth.username} ${_t(LocaleKey.NOTIFICATION_NEW)}`
    );
  }
  if (req.files) {
    const mediaFileUrls = req.files.map((file) => file.path.replace(/\\/g, '/'));
    await postMediaService.createMany(post.id, mediaFileUrls);
  }
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: constants.message.success,
    data: await postService.getById(post.id),
    error: null
  });
});

const createReplyPost = catchAsync(async (req, res, next) => {
  const { content } = pick(req.body, ['content']);
  const { postId } = pick(req.params, ['postId']);
  const myId = req.auth.id;
  if (!content && !req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.REQUIRED, 'Content or Media'));
  }
  if (!postId) {
    throw new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.REQUIRED, 'Post reference id'));
  }
  const post = await postService.createPost(myId, content, 'REPLY', postId);
  // Create notification
  if (!post.postRef.userId === myId) {
    await notificationService.createNotification(
      myId,
      post.postRef.userId,
      post.type,
      post.postRefId
    );
    socketService.emit(
      `notifications-${post.postRef.userId}`,
      `${req.auth.username} ${_t(LocaleKey.NOTIFICATION_REPLY)}`
    );
  }
  if (req.files) {
    const mediaFileUrls = req.files.map((file) => file.path.replace(/\\/g, '/'));
    await postMediaService.createMany(post.id, mediaFileUrls);
  }
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: constants.message.success,
    data: await postService.getById(post.id),
    error: null
  });
});

const getById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  const post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  await addFriendshipStatusForPostAuthor(req.auth.id, post);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: post,
    error: null
  });
});

const getRepliesById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  const { limit, page, sortBy } = getOptions(req.query);
  const { replies, total } = await postService.getRepliesById(postId, {
    limit,
    page,
    sortBy
  });
  for (let i = 0; i < replies.length; i++) {
    await addFriendshipStatusForPostAuthor(req.auth?.id, replies[i]);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: {
      replies,
      limit,
      page,
      sortBy,
      total
    },
    error: null
  });
});

const getByUserId = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ['userId']);
  const { limit, page } = getOptions(req.query);
  const { posts, total } = await postService.getByUserId(userId, {
    limit,
    page
  });
  for (let i = 0; i < posts.length; i++) {
    await addFriendshipStatusForPostAuthor(req.auth.id, posts[i]);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: { posts, limit, page, total },
    error: null
  });
});

const editContentById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  const { content } = pick(req.body, ['content']);
  let post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  if (post.user.id !== req.auth.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.UNAUTHORIZED));
  }
  post = await postService.editContentById(postId, content);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: post,
    error: null
  });
});

const deleteById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  const post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  if (post.user.id !== req.auth.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.UNAUTHORIZED));
  }
  await postService.deleteById(postId);
  for (let i = 0; i < post.media.length; i++) {
    await destroyFileByPath(post.media[i].mediaFileUrl);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: null,
    error: null
  });
});

const likePostById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  const reaction = await reactionService.create(req.auth.id, postId);
  let event = constants.event.likePost;
  if (reaction.post.type === validationConstant.postType.reply) {
    event = constants.event.likeReply;
  }
  const notification = await notificationService.createNotification(
    req.auth.id,
    reaction.post.userId,
    event,
    reaction.post.id
  );
  socketService.emit(
    `notifications-${reaction.post.userId}`,
    `${req.auth.username} ${_t(LocaleKey[`NOTIFICATION_${notification.event}`])}`
  );
  socketService.emit(`likes-increase-${reaction.post.id}`);
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: constants.message.success,
    data: _t(LocaleKey.LIKE_SUCCESS),
    error: null
  });
});

const unlikePostById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  const reaction = await reactionService.deleteById(req.auth.id, postId);
  socketService.emit(`likes-decrease-${reaction.postId}`);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: _t(LocaleKey.UNLIKE_SUCCESS),
    error: null
  });
});

const getMyLikedPosts = catchAsync(async (req, res, next) => {
  const { limit, page } = getOptions(req.query);
  const userId = req.auth.id;
  const { posts, total } = await reactionService.getPostsByLikerId(userId, {
    limit,
    page
  });
  for (let i = 0; i < posts.length; i++) {
    await addFriendshipStatusForPostAuthor(req.auth.id, posts[i]);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: { posts, limit, page, total },
    error: null
  });
});

const getLikerByPostId = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ['postId']);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, _t(LocaleKey.POST)));
  }
  const { limit, page } = getOptions(req.query);
  const { users, total } = await reactionService.getLikersByPostId(postId, {
    limit,
    page
  });
  for (let i = 0; i < users.length; i++) {
    users[i].friendshipStatus = await followService.getFriendshipStatus(req.auth.id, users[i].id);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: { users, limit, page, total },
    error: null
  });
});

const searchByContent = catchAsync(async (req, res, next) => {
  const { keyword, limit, page } = getOptions(req.query);
  const { posts, total } = await postService.searchByContent({
    limit,
    page,
    keyword
  });
  for (let i = 0; i < posts.length; i++) {
    await addFriendshipStatusForPostAuthor(req.auth?.id, posts[i]);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: { posts, limit, page, total, keyword },
    error: null
  });
});

module.exports = {
  createNewPost,
  createReplyPost,
  getById,
  getRepliesById,
  getByUserId,
  editContentById,
  deleteById,
  likePostById,
  unlikePostById,
  getMyLikedPosts,
  getLikerByPostId,
  searchByContent
};
