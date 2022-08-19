const { Activity } = require('../models');

const activity = {
  getActivities(req, res) {
    const activities = Activity.findAll();

    if (!activities) {
      res.json(`Aucune activité n'a été trouvée`);
      return;
    }

    res.json(activities);
  },

  getActivity(req, res) {
    const { id } = req.params;

    const activity = Activity.findbyPk(id);

    if (!activity) {
      res.json(`L'activité portant l'id ${id} n'existe pas`);
      return;
    }

    res.json(activity);
  }
};

module.exports = activity;
