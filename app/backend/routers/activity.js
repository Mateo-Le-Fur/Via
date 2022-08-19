const router = require('express').Router();
const activityController = require('../controllers/activityController');

router.route('/')
  .get(activityController.getActivities); // Gets all activities

router.route('/:id')
  .get(activityController.getActivity); // Gets one activity

module.exports = router;
