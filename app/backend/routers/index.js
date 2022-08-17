const router = require('express').Router();
const path = require('path');
const auth = require('../middleware/jwt');

// Authentification
router.post('/api/auth/register', auth.register);
router.post('/api/auth/login', auth.login);

// ! Route de test

router.get('/api/profil', auth.protect, (req, res) => {
  res.json({ msg: 'hello' });
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
