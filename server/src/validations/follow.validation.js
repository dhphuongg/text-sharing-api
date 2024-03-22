const Joi = require("joi");

const follow = {
  body: Joi.object({
    followingId: Joi.string().uuid().required(),
  }).options({ stripUnknown: true }),
};

module.exports = { follow };
