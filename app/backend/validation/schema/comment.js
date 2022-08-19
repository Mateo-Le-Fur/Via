const Joi = require('joi');

module.exports = Joi.object({

  text: Joi.string()
    .max(260)
    .messages({
      'string.max': 'Un commentaire ne peut dépasser 260 caractères',
    }),

});
