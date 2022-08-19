const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');

router.route('/')
  .get(dashboardController.getAllData); // Gets all users

router.route('/user/:id')
  .put(dashboardController.updateUser) // Update user via the dashboard
  .delete(dashboardController.deleteUSer); // Delete user account via the dashboard

router.route('/activity/:id')
  .put(dashboardController.updateActivity) // Update activity via the dashboard
  .delete(dashboardController.deleteActivity); // Delete activity via the dashboard

router.route('/type/:id')
  .put(dashboardController.updateType) // Update type via the dashboard
  .delete(dashboardController.deleteType); // Delete type via the dashboard

router.route('/message/:id')
  .put(dashboardController.updateMessage) // Update message via the dashboard
  .delete(dashboardController.deleteMessage); // Delete message via the dashboard

router.route('/comment/:id')
  .put(dashboardController.updateComment) // Update comment via the dashboard
  .delete(dashboardController.deleteComment); // Delete comment via the dashboard

module.exports = router;
