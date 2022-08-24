const { Activity, User } = require('../models');
const ApiError = require('../errors/apiError');

const activity = {
  async getActivities(req, res) {
    const { id } = req.user;

    let user = await User.findByPk(id);
    user = user.get();

    const activities = await Activity.findAll({
      where: {
        city: user.city,
      },
    });

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

  async participateToActivity(req, res) {
    const { userId } = req.params;
    const { activityId } = req.body;

    const activity = await Activity.findByPk(activityId);

    if (!activity) {
      throw new ApiError('Aucune utilisateur trouvé', 400);
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: Activity,
        as: 'participations',
      }],
    });

    if (!user) {
      throw new ApiError('Aucune activité trouvé', 400);
    }

    await user.addParticipations(activity);

    res.status(200).json({ msg: 'Participe' });
  },

  getParticipationsInRealTime(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const intervalId = setInterval(async (res) => {
      const participations = await User.findByPk();
      res.write(`data: ${user.like} \n\n`);
    }, 10, res);

    res.on('close', () => {
      clearInterval(intervalId);
    });
  },
};

module.exports = activity;
