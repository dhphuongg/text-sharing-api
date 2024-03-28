const Joi = require('joi');

const getMyNotifications = {
  query: Joi.object({
    limit: Joi.number().min(1).optional(),
    page: Joi.number().min(1).optional()
  }).options({ stripUnknown: true })
};

module.exports = { getMyNotifications };
