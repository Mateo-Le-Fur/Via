const router = require('express').Router();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../helpers/swaggerDoc');

const swaggerSpec = swaggerJSDoc(swaggerDoc);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
