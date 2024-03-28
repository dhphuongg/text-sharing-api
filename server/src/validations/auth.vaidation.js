const Joi = require('joi');
const { validationConstant } = require('../constants');

const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().label(validationConstant.label.user.email),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
        .label(validationConstant.label.user.password)
    })
    .options({ stripUnknown: true })
};

const register = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().required().label(validationConstant.label.user.fullName),
      email: Joi.string().email().required().label(validationConstant.label.user.email),
      username: Joi.string()
        .max(validationConstant.username.maxlength)
        .pattern(validationConstant.username.regex)
        .required()
        .label(validationConstant.label.user.username),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
        .label(validationConstant.label.user.password)
    })
    .options({ stripUnknown: true }),
  headers: Joi.object()
    .keys({
      otp: Joi.number()
        .min(validationConstant.otp.min)
        .max(validationConstant.otp.max)
        .required()
        .label(validationConstant.label.otp)
    })
    .options({ stripUnknown: true })
};

const sendOtp = {
  query: Joi.object({
    job: Joi.string()
      .valid(...Object.values(validationConstant.otp.job))
      .required(),
    email: Joi.string().email().required().label(validationConstant.label.user.email)
  }).options({ stripUnknown: true })
};

const resetPassword = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().label(validationConstant.label.user.email),
      password: Joi.string()
        .min(validationConstant.password.minLength)
        .pattern(validationConstant.password.regex)
        .required()
        .label(validationConstant.label.user.password)
    })
    .options({ stripUnknown: true }),
  headers: Joi.object()
    .keys({
      otp: Joi.number()
        .min(validationConstant.otp.min)
        .max(validationConstant.otp.max)
        .required()
        .label(validationConstant.label.otp)
    })
    .options({ stripUnknown: true })
};

module.exports = { login, register, sendOtp, resetPassword };
