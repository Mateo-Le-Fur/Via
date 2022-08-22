const router = require('express').Router();
const userController = require('../controllers/userController');
const validator = require('../validation/validator');
const userValidator = require('../validation/schema/profil');
const activityValidator = require('../validation/schema/activity');
const controllerHandler = require('../helpers/controllerHandler');

router.route('/:id')
  .get(controllerHandler(userController.getUser)) // Gets user profile
  .put(validator('body', userValidator), controllerHandler(userController.updateUser)) // Modify user profile
  .delete(userController.deleteUser); // Delete user account

router.route('/:id/activity')
  .get(controllerHandler(userController.getUserActivities)) // Gets all activities created by user
  .post(validator('body', activityValidator), controllerHandler(userController.createActivity)); // Creates a user  activity

router.route('/:id/activity/:id')
  .put(validator('body', activityValidator), controllerHandler(userController.updateUserActivity)) // Modify one activity created by user
  // eslint-disable-next-line max-len
  .delete(controllerHandler(userController.deleteUserActivity)); // Delete one activity created by user

router.route('/:id/bookmark')
  .get(controllerHandler(userController.getUserBookmarks)) // Gets all bookmarks created by user
  .post(controllerHandler(userController.addBookmark)); // Creates one bookmark by user

router.route('/:id/bookmark/:id')
  // eslint-disable-next-line max-len
  .delete(controllerHandler(userController.deleteUserBookmark)); // Delete one bookmark created by user

module.exports = router;
