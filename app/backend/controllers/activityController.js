/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { Activity, User } = require('../models');
const ApiError = require('../errors/apiError');
const dateFormat = require('../services/dateFormat');

const activity = {
  async getActivities(req, res) {
    const { id } = req.user;

    let user = await User.findByPk(id);

    user = user.get();
    if (!user) {
      throw new ApiError('Aucun utilisateur n\'a été trouvée', 400);
    }

    const activities = await Activity.findAll({
      include: ['types', 'user'],
      where: {
        city: user.city,
      },
    });

    if (!activities) {
      throw new ApiError('Aucune activité n\'a été trouvée', 400);
    }

    const result = activities.map((elem) => {
      const data = elem.get();

      const date = dateFormat.convertActivityDate(data);

      return {
        ...data, nickname: data.user.nickname, type: data.types[0].label, date,
      };
    });

    res.json(result);
  },

  async getActivity(req, res) {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: ['types', 'user'],
    });

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${id} n'existe pas`, 400);
    }

    let result = activity.get();

    result = { ...result, nickname: result.user.nickname, type: result.types[0].label };

    const { types, user, ...rest } = result;

    res.json(rest);
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

  async getParticipationsInRealTime(req, res) {
    // res.writeHead(200, {
    //   'Content-Type': 'text/event-stream',
    //   'Cache-Control': 'no-cache',
    //   Connection: 'keep-alive',
    // });

    const activity = await Activity.findAll({
      include: ['userParticip'],
    });

    activity.forEach((elem) => {
      const data = elem.get();
      console.log(data);
    });
    // let count = 0;
    // activity.userParticip.forEach((elem) => {
    //   if (elem) {
    //     count += 1;
    //   }
    // });

    // count = count.toString();
    //   const intervalId = setInterval(async (res) => {

    //     res.write(`data: ${'test'} \n\n`);
    //   }, 50, res);

    //   res.on('close', () => {
    //     clearInterval(intervalId);
    //   });
    // },
  },
};

module.exports = activity;
