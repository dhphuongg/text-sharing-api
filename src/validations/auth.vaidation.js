const Joi = require('joi');
const { validationConstant } = require('../constants');

const login = {
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
    })
    .options({ stripUnknown: true })
};

const register = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      username: Joi.string()
        .max(validationConstant.username.maxlength)
        .pattern(validationConstant.username.regex)
        .required(),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
    })
    .options({ stripUnknown: true }),
  headers: Joi.object()
    .keys({
      otp: Joi.number().min(validationConstant.otp.min).max(validationConstant.otp.max).required()
    })
    .options({ stripUnknown: true })
};

const sendOtp = {
  query: Joi.object({
    job: Joi.string()
      .valid(...Object.values(validationConstant.otp.job))
      .required(),
    email: Joi.string().email().required()
  }).options({ stripUnknown: true })
};

const resetPassword = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
    })
    .options({ stripUnknown: true }),
  headers: Joi.object()
    .keys({
      otp: Joi.number().min(validationConstant.otp.min).max(validationConstant.otp.max).required()
    })
    .options({ stripUnknown: true })
};

module.exports = { login, register, sendOtp, resetPassword };
