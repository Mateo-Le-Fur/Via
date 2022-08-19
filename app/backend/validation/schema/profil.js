const Joi = require('joi');

module.exports = Joi.object({

  firstname: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      'string.max': 'Le prénom ne peut dépasser 50 caractères',
      'string.pattern.base': 'prenom: format invalide',
    }),

  lastname: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      'string.max': 'Le nom ne peut dépasser 50 caractères',
      'string.pattern.base': ' nom: format invalide',
    }),

  description: Joi.string()
    .alphanum()
    .max(260)
    .messages({
      'string.max': 'La description ne doit pas faire plus de 260 caractères',
    }),

  address: Joi.string(),

  phone: Joi.string()
    .pattern(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
    .messages({
      'string.pattern.base': 'Le format du numéro de téléphone n\'est pas valide',
    }),

  avatar: Joi.string(),

});
