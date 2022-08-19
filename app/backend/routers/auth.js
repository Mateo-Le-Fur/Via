const router = require('express').Router();
const authController = require('../controllers/authController');

router.route('/register')
  .post(authController.register); // Sends user registration info

router.route('/login')
  .post(authController.login); // Sends user login info

router.route('/logout')
  .get(authController.logout); // Log out user from app

module.exports = router;
