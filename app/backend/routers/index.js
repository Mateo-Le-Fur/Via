const router = require('express').Router();
const auth = require('../middleware/jwt');

// Authentification
router.post('/api/auth/register', auth.register);
router.post('/api/auth/login', auth.login);

// ! Route de test

module.exports = router;
