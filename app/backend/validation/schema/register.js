const Joi = require('joi');

module.exports = Joi.object({

  nickname: Joi.string()
    .alphanum()
    .min(3)
    .error(new Error('3 caractères minimum !'))
    .max(30)
    .error(new Error('30 caractères maximum!'))
    .required(),

  city: Joi.string()
    .required(),

  email: Joi.string()
    .pattern(/^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    .error(new Error('Le format de l\'email n\'est pas valide'))
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .error(new Error('minimum 8 caractères , 1 caractère spécial et 1 chiffre !'))
    .required(),

  confirmPassword: Joi.ref('password'),

});
