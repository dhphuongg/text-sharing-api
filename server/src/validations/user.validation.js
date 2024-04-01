const Joi = require('joi');
const { validationConstant } = require('../constants');

const changePassword = {
  body: Joi.object()
    .keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required()
    })
    .options({ stripUnknown: true })
};

const updateUser = {
  body: Joi.object({
    fullName: Joi.string().optional(),
    username: Joi.string()
      .max(validationConstant.username.maxlength)
      .pattern(validationConstant.username.regex)
      .optional(),
    birthday: Joi.date().less('now').optional(),
    bio: Joi.string().max(validationConstant.maxContentLength).optional()
  }).options({ stripUnknown: true })
};

const getById = {
  params: Joi.object({ userId: Joi.string().uuid().required() }).options({
    stripUnknown: true
  })
};

const search = {
  query: Joi.object({
    limit: Joi.number().min(1).optional(),
    page: Joi.number().min(1).optional(),
    keyword: Joi.string().allow('').optional()
  }).options({ stripUnknown: true })
};

module.exports = { changePassword, updateUser, getById, search };
