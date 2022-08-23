const { Activity } = require('../models');
const ApiError = require('../errors/apiError');

const activity = {
  async getActivities(req, res) {
    const activities = await Activity.findAll();

    if (!activities) {
      throw new ApiError('Aucune activité n\'a été trouvée', 400);
    }

    res.json(activities);
  },

  async getActivity(req, res) {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${id} n'existe pas`, 400);
    }

    res.json(activity);
  },
};

module.exports = activity;
