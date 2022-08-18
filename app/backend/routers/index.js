const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const auth = require('./auth');

router.use('/auth', auth);

// ! Route de test

router.get('/api/profil', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

router.get('/api/auth/current', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
