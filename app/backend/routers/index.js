const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const auth = require('./auth');

// ! test
const userController = require('../controllers/userController');

router.use('/api/auth', auth);

// ! Route de test
router.get('/api/user/:id/activity', userController.getUserActivities);
router.post('/api/user/:id/activity/:id', userController.getUserActivities);

router.get('/api/profil', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

router.get('/api/auth/current', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
