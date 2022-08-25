/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { Activity, User } = require('../models');
const ApiError = require('../errors/apiError');
const dateFormat = require('../services/dateFormat');

let globalVersion = 0;

const activity = {

  async getActivities(req, res) {
    const { id } = req.user;

    let getUser = await User.findByPk(id);

    getUser = getUser.get();
    if (!getUser) {
      throw new ApiError('Aucun utilisateur n\'a été trouvée', 400);
    }

    const activities = await Activity.findAll({
      include: ['types', 'user'],
      where: {
        city: getUser.city,
      },
    });

    if (!activities) {
      throw new ApiError('Aucune activité n\'a été trouvée', 400);
    }

    const result = activities.map((elem) => {
      let data = elem.get();

      const date = dateFormat.convertActivityDate(data);

      data = {
        ...data, nickname: data.user.nickname, type: data.types[0].label, date,
      };

      const { types, user, ...rest } = data;

      return rest;
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

    const date = dateFormat.convertActivityDate(result);

    result = {
      ...result, nickname: result.user.nickname, type: result.types[0].label, date,
    };

    const { types, user, ...rest } = result;

    res.json(rest);
  },

  async participateToActivity(req, res) {
    const { userId } = req.params;
    const { activityId } = req.body;
    const { id } = req.user;

    console.log(userId, id);

    if (id != userId) {
      throw new ApiError('Forbidden', 400);
    }

    const activity = await Activity.findByPk(activityId);

    if (!activity) {
      throw new ApiError('Aucune activité trouvé', 400);
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: Activity,
        as: 'participations',
      }],
    });

    if (!user) {
      throw new ApiError('Aucune utilisateur trouvé', 400);
    }

    await user.addParticipations(activity);

    globalVersion += 1;

    res.status(200).json({ msg: 'Participe' });
  },

  async getParticipationsInRealTime(req, res) {
    let localVersion = 0;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const intervalId = setInterval(async (res) => {
      if (localVersion < globalVersion) {
        const { id } = req.user;

        console.log(id);

        const user = await User.findByPk(id);

        if (!user) {
          throw new ApiError('Utilisateur introuvable', 400);
        }
        const activity = await Activity.findAll({

          include: ['userParticip'],
          attributes: ['id', 'city'],

          order: [
            ['id', 'asc'],
          ],

          where: {
            city: user.city,
          },

        });

        const result = activity.map((elem) => {
          const count = elem.userParticip.length;
          return { activityId: elem.id, count };
        });

        console.log(result);

        localVersion = globalVersion;

        res.write(`data: ${JSON.stringify(result)} \n\n`);
      }
    }, 100, res);

    res.on('close', () => {
      clearInterval(intervalId);
    });
  },
};

module.exports = activity;
