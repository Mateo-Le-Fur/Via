const Joi = require('joi');

module.exports = Joi.object({

  nickname: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'La valeur doit être de type text',
      'string.min': '3 caractères minimum !',
      'string.max': '30 caractères maximum',
      'any.required': 'champ requis',
      'string.empty': 'champ requis',
    }),

  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'champ requis',
    }),

  email: Joi.string()

    .pattern(/^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    .required()
    .messages({
      'string.pattern.base': 'Le format de l\'email n\'est pas valide',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .messages({
      'minimum 8 caractères': '1 caractère spécial et 1 chiffre !',
    }),

  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    .messages({
      'any.only': 'Les mots de passes doivent être indentique',
    }),

});
