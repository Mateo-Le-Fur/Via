const Joi = require('joi');

module.exports = Joi.object({

  name: Joi.string()
    .max(50)
    .messages({
      'string.max': 'Le nom de l\'activité ne peut dépasser 50 caractères',
    }),

  description: Joi.string()
    .max(260)
    .messages({
      'string.max': 'La description ne doit pas faire plus de 260 caractères',
    }),

  date: Joi.string(),

  address: Joi.string(),

  city: Joi.string()
    .max(80)
    .messages({
      'string.max': 'La ville ne peut dépasser plus de 80 caractères',
    }),

});
