const router = require("express").Router();
const dashboardController = require("../controllers/dashboardController");
const validator = require("../validation/validator");
const activityValidator = require("../validation/schema/activity");
const commentValidator = require("../validation/schema/comment");
const userValidator = require("../validation/schema/profil");

router.route("/").get(dashboardController.getAllData); // Gets all users

router
  .route("/user/:id")
  .put(validator("body", userValidator), dashboardController.updateUser) // Update user via the dashboard
  .delete(dashboardController.deleteUSer); // Delete user account via the dashboard

router
  .route("/activity/:id")
  .put(validator("body", activityValidator), dashboardController.updateActivity) // Update activity via the dashboard
  .delete(dashboardController.deleteActivity); // Delete activity via the dashboard

router
  .route("/type/:id")
  .put(dashboardController.updateType) // Update type via the dashboard
  .delete(dashboardController.deleteType); // Delete type via the dashboard

router
  .route("/message/:id")
  .put(dashboardController.updateMessage) // Update message via the dashboard
  .delete(dashboardController.deleteMessage); // Delete message via the dashboard

router
  .route("/comment/:id")
  .put(validator("body", commentValidator), dashboardController.updateComment) // Update comment via the dashboard
  .delete(dashboardController.deleteComment); // Delete comment via the dashboard

module.exports = router;
