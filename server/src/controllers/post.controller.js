const httpStatus = require("http-status");

const { postService, postMediaService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { messageConstant, validationConstant } = require("../constants");
const ApiError = require("../utils/ApiError");

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
  if (type !== validationConstant.post.type.new) {
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
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: post,
    error: null,
  });
});

module.exports = { createNewPost, getById };
