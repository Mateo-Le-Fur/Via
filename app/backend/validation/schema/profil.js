const Joi = require('joi');

module.exports = Joi.object({

  firstname: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .error(new Error({ msg: 'Le prénom ne peut contenir que des caractères' })),

  lastname: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .error(new Error('Le nom ne peut contenir que des caractères')),

  phone: Joi.string()
    .pattern(/(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
    .error(new Error('Le format du numéro de téléphone n\'est pas valide')),

  description: Joi.string()
    .alphanum()
    .max(260)
    .error(new Error('La description ne doit pas faire plus de 260 caractères')),

});
