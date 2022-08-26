const Joi = require('joi');

module.exports = Joi.object({

  name: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'Champ requis !',
      'string.max': 'Le nom de l\'activité ne peut dépasser 50 caractères',
    }),

  description: Joi.string()
    .max(260)
    .required()
    .messages({
      'string.max': 'La description ne doit pas faire plus de 260 caractères',
    }),

  date: Joi.string().required(),

  address: Joi.string().required()
    .messages({
      'string.empty': 'Champ requis !',
    }),

  type: Joi.string()
    .required(),
});
