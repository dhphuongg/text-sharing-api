const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { messageConstant } = require("../constants");
const { followService } = require("../services");
const ApiError = require("../utils/ApiError");

const follow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.body, ["userId"]);
  if (req.auth.id === userId) {
    return next(
      new ApiError(httpStatus.BAD_REQUEST, messageConstant.follow.selfFollow)
    );
  } else if (await followService.getById(req.auth.id, userId)) {
    return next(
      new ApiError(httpStatus.BAD_REQUEST, messageConstant.already("Follow"))
    );
  }
  const follow = await followService.createById(req.auth.id, userId);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: follow,
    error: null,
  });
});

const unfollow = catchAsync(async (req, res, next) => {
  const { userId } = pick(req.body, ["userId"]);
  if (req.auth.id === userId) {
    return next(
      new ApiError(httpStatus.BAD_REQUEST, messageConstant.follow.selfUnfollow)
    );
  } else if (!(await followService.getById(req.auth.id, userId))) {
    return next(
      new ApiError(httpStatus.BAD_REQUEST, messageConstant.notFound("Follow"))
    );
  }
  const follow = await followService.deleteById(req.auth.id, userId);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: null,
    error: null,
  });
});

module.exports = { follow, unfollow };
