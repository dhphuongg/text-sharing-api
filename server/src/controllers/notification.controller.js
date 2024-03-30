const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { constants } = require('../constants');
const { notificationService } = require('../services');
const { getOptions } = require('../utils/getPaginationAndSort');

const getMyNotifications = catchAsync(async (req, res, next) => {
  const { limit, page } = getOptions(req.query);
  const { notifications, total } = await notificationService.getNotificationsByReceiver(
    req.auth.id,
    { limit, page }
  );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: constants.message.success,
    data: { notifications, limit, page, total },
    error: null
  });
});

module.exports = { getMyNotifications };
