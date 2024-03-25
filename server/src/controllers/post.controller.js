const httpStatus = require("http-status");

const { postService, postMediaService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { messageConstant, validationConstant } = require("../constants");
const ApiError = require("../utils/ApiError");
const destroyFileByPath = require("../utils/destroyFile");

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
    await postMediaService.create(post.id, mediaFileUrls);
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

module.exports = { createNewPost, getById, deleteById };
