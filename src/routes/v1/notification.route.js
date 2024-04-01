const router = require('express').Router();

const { validate } = require('../../middlewares');
const { notificationValidation } = require('../../validations');
const { notificationController } = require('../../controllers');

router.get(
  '/',
  validate(notificationValidation.getMyNotifications),
  notificationController.getMyNotifications
);

module.exports = router;
