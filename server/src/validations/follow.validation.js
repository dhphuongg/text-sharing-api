const Joi = require("joi");

const follow = {
  body: Joi.object({
    userId: Joi.string().uuid().required(),
  }).options({ stripUnknown: true }),
};

module.exports = { follow };
