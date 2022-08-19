const { Activity } = require('../models');

const activity = {
  async getActivities(req, res) {
    const activities = await Activity.findAll();

    if (!activities) {
      res.json('Aucune activité n\'a été trouvée');
      return;
    }

    res.json(activities);
  },

  async getActivity(req, res) {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      res.json(`L'activité portant l'id ${id} n'existe pas`);
      return;
    }

    res.json(activity);
  },
};

module.exports = activity;
