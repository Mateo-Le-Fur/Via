const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const auth = require('./auth');

// ! test
const userController = require('../controllers/userController');

router.use('/api/auth', auth);

// ! Route de test
router.get('/user/:id/activity', userController.getUserActivities);

router.put('/user/:userId/activity/:activityId', userController.updateUserActivity);

router.post('/user/:id/activity', userController.createActivity);

router.delete('/user/:userId/activity/:activityId', userController.deleteUserActivity);

router.post('/user/:userId/bookmark', userController.addBookmark);
router.get('/user/:id/bookmark', userController.getUserBookmark);
router.delete('/user/:userId/bookmark/:activityId', userController.deleteUserBookmark);

router.get('/profil', authJWT.protect, (req, res) => {
  const { user } = req;
  res.json(user);
});

router.get('/api/auth/current', authJWT.protect, (req, res) => {
  const { user } = req;
  res.json(user);
});

module.exports = router;
