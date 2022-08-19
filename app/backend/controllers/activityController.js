const { Activity } = require('../models');

const activity = {
  getActivities(req, res) {
    const activites = Activity.findAll();

    res.json(activites);
  },

  getActivity(req, res) {
    const { id } = req.params;

    const activity = Activity.findbyPk(id);

    res.json(activity);
  }
};

module.exports = activity;
