const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const auth = require('./auth');

// ! test
const userController = require('../controllers/userController');

router.use('/api/auth', auth);

// ! Route de test
router.get('/api/user/:id/activity', userController.getUserActivities);

router.put('/api/user/:userId/activity/:activityId', userController.updateUserActivity);

router.post('/api/user/:id/activity', userController.createActivity);

router.delete('/api/user/:userId/activity/:activityId', userController.deleteUserActivity);

router.post('/api/user/:userId/bookmark', userController.addBookmark);
router.get('/api/user/:id/bookmark', userController.getBookmark);

router.get('/api/profil', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

router.get('/api/auth/current', authJWT.protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
