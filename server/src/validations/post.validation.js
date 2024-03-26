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

const getRepliesById = {
  params: Joi.object({ id: Joi.string().uuid().required() }).options({
    stripUnknown: true,
  }),
  query: Joi.object({
    limit: Joi.number().min(1).optional(),
    page: Joi.number().min(1).optional(),
    sortBy: Joi.string().optional(),
  }).options({ stripUnknown: true }),
};

const getByUserId = {
  params: Joi.object({ userId: Joi.string().uuid().required() }).options({
    stripUnknown: true,
  }),
  query: Joi.object({
    limit: Joi.number().min(1).optional(),
    page: Joi.number().min(1).optional(),
  }).options({ stripUnknown: true }),
};

const editContentByID = {
  body: Joi.object({
    content: Joi.string().max(500).required(),
  }).options({ stripUnknown: true }),
  params: Joi.object({ id: Joi.string().uuid().required() }).options({
    stripUnknown: true,
  }),
};

const likePost = {
  params: Joi.object({
    postId: Joi.string().uuid().required(),
  }).options({ stripUnknown: true }),
};

module.exports = {
  createNewPost,
  getById,
  getRepliesById,
  getByUserId,
  editContentByID,
  likePost,
};
