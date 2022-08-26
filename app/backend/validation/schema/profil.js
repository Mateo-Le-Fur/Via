const Joi = require('joi');

module.exports = Joi.object({

  firstname: Joi.string()
    .allow(null, '')
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      'string.empty': 'firstname: Chaine vide !',
      'string.max': 'Le prénom ne peut dépasser 50 caractères',
      'string.pattern.base': 'prenom: format invalide',
    }),

  lastname: Joi.string()
    .allow(null, '')
    .max(50)
    .pattern(/^[a-zA-Z]+$/)
    .trim(false)
    .messages({
      'string.max': 'Le nom ne peut dépasser 50 caractères',
      'string.pattern.base': ' nom: format invalide',
    }),

  description: Joi.string()
    .allow(null, '')
    .max(260)
    .messages({
      'string.max': 'La description ne doit pas faire plus de 260 caractères',
    }),

  address: Joi.string()
    .allow(null, ''),

  phone: Joi.string()
    .allow(null, '')
    .pattern(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
    .messages({
      'string.pattern.base': 'Le format du numéro de téléphone n\'est pas valide',
    }),

  avatar: Joi.string(),

});
