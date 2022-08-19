const router = require('express').Router();
const authController = require('../controllers/authController');
const authJWT = require('../middleware/jwt');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authJWT.protect, authController.logout);

module.exports = router;
