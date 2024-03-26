const Joi = require("joi");
const { validationConstant } = require("../constants");

const changePassword = {
  body: Joi.object()
    .keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    })
    .options({ stripUnknown: true }),
};

const updateUser = {
  body: Joi.object({
    fullName: Joi.string()
      .optional()
      .label(validationConstant.label.user.fullName),
    username: Joi.string()
      .max(validationConstant.username.maxlength)
      .pattern(validationConstant.username.regex)
      .optional()
      .label(validationConstant.label.user.username),
    birthday: Joi.date().less("now").optional(),
    bio: Joi.string().max(validationConstant.bio.maxLength).optional(),
  }).options({ stripUnknown: true }),
};

const getById = {
  params: Joi.object({ userId: Joi.string().uuid().required() }).options({
    stripUnknown: true,
  }),
};

module.exports = { changePassword, updateUser, getById };
