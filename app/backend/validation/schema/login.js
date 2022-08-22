const Joi = require('joi');

module.exports = Joi.object({

  email: Joi.string()

    .pattern(/^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    .error(new Error('Le format de l\'email n\'est pas valide'))
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .error(new Error('minimum 8 caractères , 1 caractère spécial et 1 chiffre !'))
    .required(),
});
