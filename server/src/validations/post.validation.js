const Joi = require("joi");
const { validationConstant } = require("../constants");

const createNewPost = {
  body: Joi.object({
    content: Joi.string().max(500).optional(),
    type: Joi.string()
      .valid(...Object.values(validationConstant.post.type))
      .optional(),
    postRefId: Joi.string().uuid().optional(),
  }).options({ stripUnknown: true }),
};

const getById = {
  params: Joi.object({ id: Joi.string().uuid().required() }).options({
    stripUnknown: true,
  }),
};

module.exports = { createNewPost, getById };
