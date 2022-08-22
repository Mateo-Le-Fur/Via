const router = require('express').Router();
const authController = require('../controllers/authController');
const controllerHandler = require('../helpers/controllerHandler');
const validator = require('../validation/validator');
const loginValidator = require('../validation/schema/login');
const registerValidator = require('../validation/schema/register');

router.route('/register')
  .post(validator('body', registerValidator), controllerHandler(authController.register)); // Sends user registration info

router.route('/login')
  .post(validator('body', loginValidator), controllerHandler(authController.login)); // Sends user login info

router.route('/logout')
  .get(controllerHandler(authController.logout)); // Log out user from app

module.exports = router;
