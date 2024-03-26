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
  const post = await postService.getById(req.params.id);
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
  const { id } = pick(req.params, ["id"]);
  const { limit, page, sortBy } = getOptions(req.query);
  const { replies, total } = await postService.getRepliesById(id, {
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
  const { id } = pick(req.params, ["id"]);
  const { content } = pick(req.body, ["content"]);
  const post = await postService.editContentById(id, content);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: post,
    error: null,
  });
});

const deleteById = catchAsync(async (req, res, next) => {
  const { id } = pick(req.params, ["id"]);
  const post = await postService.deleteById(id);
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

module.exports = {
  createNewPost,
  getById,
  getRepliesById,
  getByUserId,
  editContentById,
  deleteById,
  likePostById,
  unlikePostById,
};
