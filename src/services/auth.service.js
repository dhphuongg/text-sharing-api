const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const ejs = require('ejs');
const path = require('path');

const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const jwt = require('../utils/jwt');
const { constants, validationConstant } = require('../constants');
const userService = require('./user.service');
const otpService = require('./otp.service');
const mailService = require('./mail.service');
const LocaleKey = require('../locales/key.locale');

const login = async ({ username, password }) => {
  const user = await userService.getByUsernameOrEmail(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, _t(LocaleKey.ACCOUNT_INCORRECT));
  }
  const accessToken = jwt.generateToken(user.id, constants.tokenType.access);
  const refreshToken = jwt.generateToken(user.id, constants.tokenType.refresh);
  return {
    user: await userService.getById(user.id),
    accessToken,
    refreshToken
  };
};

const register = async ({ fullName, email, username, password }) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await userService.create({
    fullName,
    email,
    username,
    password
  });
  return user;
};

const sendOtp = async (email, job) => {
  const oldOtp = await otpService.getByEmail(email);

  let newOtp;
  if (job === validationConstant.otp.job.resetPassword) {
    if (!oldOtp || !oldOtp.user) {
      throw new ApiError(httpStatus.NOT_FOUND, _t(LocaleKey.NOT_FOUND, 'Email'));
    }
    newOtp = await otpService.updateOtpByEmail(email, job);
  } else if (job === validationConstant.otp.job.register) {
    if (oldOtp) {
      if (oldOtp.user) {
        throw new ApiError(httpStatus.BAD_REQUEST, _t(LocaleKey.ACCOUNT_ALREADY));
      }
      newOtp = await otpService.updateOtpByEmail(email, job);
    } else {
      newOtp = await otpService.create(email, job);
    }
  }

  const jobMailShow = {
    [validationConstant.otp.job.register]: 'Register',
    [validationConstant.otp.job.resetPassword]: 'Reset password'
  };

  const template = await ejs.renderFile(
    path.join(__dirname, '../templates/send-otp.template.ejs'),
    { job: jobMailShow[job], exp: config.otp.exp, otpCode: newOtp.code }
  );
  mailService.sendMailHelper(email, `${constants.app.name} OTP`, template);
  return newOtp;
};

const resetPassword = async (userId, password) => {
  return await userService.updatePasswordById(userId, password);
};

module.exports = { login, register, sendOtp, resetPassword };
