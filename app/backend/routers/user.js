const router = require('express').Router();
const authController = require('../controllers/userController');

router.route('/:id')
  .get(userController.getUser) // Gets user profile
  .put(userController.updateUser) // Modify user profile
  .delete(userController.deleteUser); // Delete user account

router.route('/:id/activity')
  .get(userController.getUserActivities) // Gets all activities created by user
  .post(userController.createActivity) // Creates a user  activity

router.route('/:id/activity/:id')
  .put(userController.updateUserActivty) // Modify one activity created by user
  .delete(userController.deleteUserActivity) // Delete one activity created by user

router.route('/:id/bookmark')
  .get(userController.getUserBookmarks) // Gets all bookmarks created by user
  .post(userController.addBookmark) // Creates one bookmark by user

router.route('/:id/bookmark/:id')
  .delete(userController.deleteUserBookmark) // Delete one bookmark created by user

module.exports = router;
