const router = require('express').Router();
const authController = require('../controllers/authController');
const controllerHandler = require('../helpers/controllerHandler');

router.route('/register')
  .post(controllerHandler(authController.register)); // Sends user registration info

router.route('/login')
  .post(controllerHandler(authController.login)); // Sends user login info

router.route('/logout')
  .get(controllerHandler(authController.logout)); // Log out user from app

module.exports = router;
