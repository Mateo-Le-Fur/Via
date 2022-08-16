const router = require('express').Router();
const auth = require('../middleware/jwt');

router.post('/api/auth/register');
router.post('/api/auth/login', auth.login);

router.get('/home', auth.protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
