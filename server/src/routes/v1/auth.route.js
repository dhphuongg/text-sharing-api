const router = require('express').Router();

const { validate } = require('../../middlewares');
const { authValidation } = require('../../validations');
const { authController } = require('../../controllers');

router
  .post('/login', validate(authValidation.login), authController.login)
  .get('/send-otp', validate(authValidation.sendOtp), authController.sendOtp)
  .post('/register', validate(authValidation.register), authController.register)
  .post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
