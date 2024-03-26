const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { authService, otpService } = require("../services");
const {
  messageConstant,
  constants,
  validationConstant,
} = require("../constants");

const login = catchAsync(async (req, res, next) => {
  const body = pick(req.body, ["email", "password"]);
  const { user, accessToken, refreshToken } = await authService.login(body);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: { user, accessToken, refreshToken },
    error: null,
  });
});

const register = catchAsync(async (req, res, next) => {
  const body = pick(req.body, ["fullName", "username", "email", "password"]);
  await otpService.verify(
    body.email,
    req.headers.otp,
    validationConstant.otp.job.register
  );
  const user = await authService.register(body);
  return res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: messageConstant.responseStatus.success,
    data: user,
    error: null,
  });
});

const sendOtp = catchAsync(async (req, res, next) => {
  const { job, email } = pick(req.query, ["job", "email"]);
  const otp = await authService.sendOtp(email, job);
  const data =
    job === constants.validation.otp.job.register
      ? messageConstant.mail.success("an OTP")
      : otp.user;
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data,
    error: null,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email, password } = pick(req.body, ["email", "password"]);
  const { otp: otpCode } = pick(req.headers, ["otp"]);
  const o = await otpService.verify(
    email,
    otpCode,
    validationConstant.otp.job.resetPassword
  );
  await authService.resetPassword(o.user.id, password);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.responseStatus.success,
    data: messageConstant.password.resetSuccess,
    error: null,
  });
});

module.exports = { login, register, sendOtp, resetPassword };
