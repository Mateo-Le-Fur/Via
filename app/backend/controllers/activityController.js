/* eslint-disable object-curly-newline */
/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { Activity, User, Type, Comment } = require('../models');
const ApiError = require('../errors/apiError');
const dateFormat = require('../services/dateFormat');
const SSEHandler = require('../services/SSEHandler');
const sequelize = require('../config/sequelize');

// On créer une instance du sseHandler avec le nom du salon de communication
const sseHandlerParticipate = new SSEHandler('Participations');
const sseHandlerComments = new SSEHandler('Commentaires');

const activity = {
  url: 'http://localhost:8080',

  async getActivities(req, res) {
    const { id } = req.user;

    const getUser = await User.findByPk(id, {
      raw: true,
      attributes: ['city'],
    });

    if (!getUser) {
      throw new ApiError("Aucun utilisateur n'a été trouvée", 400);
    }

    let activities = await Activity.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
        {
          model: Type,
          as: 'types',
          attributes: ['label'],
        },
      ],
      where: {
        city: getUser.city,
      },
      attributes: {
        include: [
          'user.nickname',
          'types.label',
          [sequelize.literal('label'), 'type'],
        ],
      },
      raw: true,
      nest: true,
    });

    if (!activities) {
      throw new ApiError("Aucune activité n'a été trouvée", 400);
    }

    activities = activities.map((element) => {
      let data = element;

      const date = dateFormat.convertActivityDate(data);

      data = { ...data, date };

      const { user, types, label, ...rest } = data;

      return rest;
    });

    res.json(activities);
  },

  async getActivity(req, res) {
    const { id } = req.params;

    let activity = await Activity.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Type,
          as: 'types',
          attributes: ['label'],
        },
      ],
      attributes: {
        include: ['types.label', [sequelize.literal('label'), 'type']],
      },
    });

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${id} n'existe pas`, 400);
    }

    activity = activity.get();
    const getUser = activity.user.get();

    const date = dateFormat.convertActivityDate(activity);

    const result = {
      ...getUser,
      userDescription: getUser.description,
      userAddress: getUser.address,
    };

    activity = {
      ...result,
      ...activity,
      date,
      url: `http://localhost:8080/api/user/${getUser.id}/avatar`,
    };

    const { user, types, ...rest } = activity;

    res.json(rest);
  },

  async getCommentsSSE(req, res) {
    const { activityId } = req.params;
    const { id } = req.user;

    sseHandlerComments.newConnection(id);

    let activity = await Activity.findByPk(activityId, {
      include: ['comments'],
    });

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${id} n'existe pas`, 400);
    }

    activity = JSON.parse(JSON.stringify(activity));

    sseHandlerComments.sendDataToClients(activity);

    res.on('close', () => {
      sseHandlerParticipate.closeConnection(id);
    });
  },

  async getComments(req, res) {
    const { activityId } = req.params;

    const activity = await Activity.findByPk(activityId, {
      include: ['comments'],
    });

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${activityId} n'existe pas`, 400);
    }

    res.json(activity);
  },

  async createComment(req, res) {
    const { activityId } = req.params;
    const { userId } = req.body;

    if (!req.body.text) {
      throw new ApiError('Le commentaire ne peut être vide', 400);
    }

    const comment = await Comment.create({
      text: req.body.text,
      user_id: userId,
      activity_id: activityId,
    });

    res.json(comment);
  },

  async participateToActivity(req, res) {
    const { userId } = req.params;
    const { activityId } = req.body;
    const { id } = req.user;

    if (id !== parseInt(userId, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    const getActivity = await Activity.findByPk(activityId, {
      attributes: ['id', 'city'],
    });

    if (!getActivity) {
      throw new ApiError('Aucune activité trouvé', 400);
    }

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Activity,
          as: 'participations',
          attributes: ['id'],
        },
      ],
    });

    if (!user) {
      throw new ApiError('Aucune utilisateur trouvé', 400);
    }

    if (user.dataValues.city !== getActivity.dataValues.city) {
      throw new ApiError(
        'Vous ne pouvez pas parcitiper à une activité de cette ville',
        403,
      );
    }

    await user.addParticipations(getActivity);

    // Le fait d'incrementer cette variable va permettre au serveur d'envoyer les données en temps réel

    const data = await activity.getParticipations(req);

    sseHandlerParticipate.broadcast(data, data[0].city);

    res.status(200).json({ msg: 'Participe' });
  },

  async getParticipations(req) {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      attributes: ['city'],
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    let activity = await Activity.findAll({
      include: [
        {
          model: User,
          as: 'userParticip',
          attributes: ['id'],
          nested: false,
        },
      ],
      attributes: ['id', 'city'],
      order: [['id', 'asc']],
      where: {
        city: user.city,
      },
    });

    activity = activity.map((element) => {
      let data = element.get();
      const count = data.userParticip.length;
      data = {
        ...data,
        count,
      };
      delete data.userParticip;

      return data;
    });

    return activity;
  },

  async getParticipationsInRealTime(req, res) {
    const { city } = req.params;
    const { id } = req.user;

    const user = await User.findByPk(id, {
      attributes: ['city'],
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    if (user.city !== city) {
      throw new ApiError(
        'Vous ne pouvez pas obtenir les informations de cette ville',
        403,
      );
    }

    sseHandlerParticipate.newConnection(id, res);

    let activity = await Activity.findAll({

      include: [
        {
          model: User,
          as: 'userParticip',
          attributes: ['id'],
        },
      ],
      attributes: ['id', 'city'],
      order: [['id', 'asc']],
      where: {
        city: user.city,
      },
    });

    activity = activity.map((element) => {
      let data = element.get();
      const count = data.userParticip.length;
      data = {
        ...data,
        count,
      };
      delete data.userParticip;
      return data;
    });

    sseHandlerParticipate.broadcast(activity, activity[0].city);

    res.on('close', () => {
      sseHandlerParticipate.closeConnection(id);
    });
  },
};

module.exports = activity;
