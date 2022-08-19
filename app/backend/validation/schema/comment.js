const Joi = require('joi');

module.exports = Joi.object({

  text: Joi.string()
    .alphanum()
    .max(260)
    .error(new Error('Un commentaire ne doit pas faire plus de 260 caractères')),

});
