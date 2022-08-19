const router = require('express').Router();
const authController = require('../controllers/authController');
const authJWT = require('../middleware/jwt');
const validator = require('../validation/validator');
const registerSchema = require('../validation/schema/register');

router.post('/register', validator('body', registerSchema), authController.register);
router.post('/login', authController.login);
router.get('/logout', authJWT.protect, authController.logout);

module.exports = router;
