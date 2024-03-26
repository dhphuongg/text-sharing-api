const httpStatus = require("http-status");

const {
  postService,
  postMediaService,
  reactionService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { messageConstant, validationConstant } = require("../constants");
const ApiError = require("../utils/ApiError");
const destroyFileByPath = require("../utils/destroyFile");
const { getOptions } = require("../utils/getPaginationAndSort");

const createNewPost = catchAsync(async (req, res, next) => {
  const { content, type, postRefId } = pick(req.body, [
    "content",
    "type",
    "postRefId",
  ]);

  if (!content && !req.files) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      messageConstant.required("Content or Media")
    );
  }
  let post;
  if (type && type !== validationConstant.post.type.new) {
    if (!postRefId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        messageConstant.required("Post reference id")
      );
    }
    post = await postService.createNewPost(
      req.auth.id,
      content,
      type,
      postRefId
    );
  } else {
    post = await postService.createNewPost(req.auth.id, content);
  }
  if (req.files) {
    const mediaFileUrls = req.files.map((file) =>
      file.path.replace(/\\/g, "/")
    );
    await postMediaService.createMany(post.id, mediaFileUrls);
  }
  const postRes = await postService.getById(post.id);
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: messageConstant.responseStatus.success,
    data: postRes,
    error: null,
  });
});

const getById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  const post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: post,
    error: null,
  });
});

const getRepliesById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  const { limit, page, sortBy } = getOptions(req.query);
  const { replies, total } = await postService.getRepliesById(postId, {
    limit,
    page,
    sortBy,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: {
      replies: replies,
      limit,
      page,
      sortBy,
      total,
    },
    error: null,
  });
});

const getByUserId = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.params, ["userId"]);
  const { limit, page } = getOptions(req.query);
  const { posts, total } = await postService.getByUserId(userId, {
    limit,
    page,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { posts, limit, page, total },
    error: null,
  });
});

const editContentById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  const { content } = pick(req.body, ["content"]);
  let post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  if (post.user.id !== req.auth.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized);
  }
  post = await postService.editContentById(postId, content);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: post,
    error: null,
  });
});

const deleteById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  const post = await postService.getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  if (post.user.id !== req.auth.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized);
  }
  await postService.deleteById(postId);
  for (let i = 0; i < post.media.length; i++) {
    await destroyFileByPath(post.media[i].mediaFileUrl);
  }
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: null,
    error: null,
  });
});

const likePostById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  const reaction = await reactionService.create(req.auth.id, postId);
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: messageConstant.responseStatus.success,
    data: reaction,
    error: null,
  });
});

const unlikePostById = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  const reaction = await reactionService.deleteById(req.auth.id, postId);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: reaction,
    error: null,
  });
});

const getMyLikedPosts = catchAsync(async (req, res, next) => {
  const { limit, page } = getOptions(req.query);
  const userId = req.auth.id;
  const { posts, total } = await reactionService.getPostsByLikerId(userId, {
    limit,
    page,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { posts, limit, page, total },
    error: null,
  });
});

const getLikerByPostId = catchAsync(async (req, res, next) => {
  const { postId } = pick(req.params, ["postId"]);
  if (!(await postService.getById(postId))) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Post"));
  }
  const { limit, page } = getOptions(req.query);
  const { users, total } = await reactionService.getLikersByPostId(postId, {
    limit,
    page,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { users, limit, page, total },
    error: null,
  });
});

module.exports = {
  createNewPost,
  getById,
  getRepliesById,
  getByUserId,
  editContentById,
  deleteById,
  likePostById,
  unlikePostById,
  getMyLikedPosts,
  getLikerByPostId,
};
