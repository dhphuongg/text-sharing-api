const httpStatus = require("http-status");

const config = require("../config/config");
const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");
const { otpGenerator } = require("../utils/random");
const { messageConstant, validationConstant } = require("../constants");

const create = async (email, job) => {
  const otp = await prisma.otp.create({
    data: {
      email,
      code: otpGenerator(
        validationConstant.otp.min,
        validationConstant.otp.max
      ),
      job,
      deletedAt: new Date(Date.now() + config.otp.exp * 60 * 1000),
    },
    include: { user: true },
  });
  otp.user && delete otp.user.password;
  return otp;
};

const getByEmail = async (email) => {
  const otp = await prisma.otp.findUnique({
    where: { email },
    include: { user: true },
  });
  otp && otp.user && delete otp.user.password;
  return otp;
};

const updateOtpByEmail = async (email, job) => {
  const otp = await prisma.otp.update({
    where: { email },
    data: {
      code: otpGenerator(
        validationConstant.otp.min,
        validationConstant.otp.max
      ),
      job,
      deletedAt: new Date(Date.now() + config.otp.exp * 60 * 1000),
    },
    include: { user: true },
  });
  otp.user && delete otp.user.password;
  return otp;
};

const verify = async (email, otpCode, job) => {
  const otp = await getByEmail(email);
  if (!otp) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Email"));
  } else if (otp.code !== parseInt(otpCode) || otp.job !== job) {
    throw new ApiError(httpStatus.BAD_REQUEST, messageConstant.otp.invalid);
  } else if (new Date(otp.deletedAt) < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, messageConstant.otp.expired);
  }
  const newOtp = await prisma.otp.update({
    where: { email },
    data: { code: 0, job: null },
    include: { user: true },
  });
  newOtp.user && delete newOtp.user.password;
  return newOtp;
};

module.exports = { create, getByEmail, updateOtpByEmail, verify };
