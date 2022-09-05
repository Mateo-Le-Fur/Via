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

      const date = dateFormat.convertActivityDate(data.date);

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

    const date = dateFormat.convertActivityDate(activity.date);

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
    const { id } = req.user;

    sseHandlerComments.newConnection(id, res);

    sseHandlerComments.broadcast('init', 'comment');

    res.on('close', () => {
      sseHandlerComments.closeConnection(id);
    });
  },

  async getComments(req, res) {
    const { id } = req.user;

    const getUser = await User.findByPk(id, {
      attributes: ['city'],
    });

    if (!getUser) {
      throw new ApiError("Aucun utilisateur n'a été trouvée", 400);
    }

    const activity = await Activity.findAll({
      include: [
        {
          model: Comment,
          as: 'comments',
        },
        {
          model: User,
          as: 'user',
          attributes: ['nickname'],
        },
      ],
      where: {
        city: getUser.city,
      },
      attributes: ['id'],
      order: [
        [{ model: Comment, as: 'comments' }, 'created_at', 'asc'],
      ],
    });

    if (!activity) {
      throw new ApiError('Aucune activité trouvé', 400);
    }

    const activities = JSON.parse(JSON.stringify(activity));

    const data = [];
    activities.forEach((activity) => {
      activity.comments.forEach((comment) => {
        let result = comment;
        result = {
          ...result,
          nickname: activity.user.nickname,
          avatar: `http://localhost:8080/api/user/${result.user_id}/avatar`,
          date: dateFormat.convertActivityDate(result.created_at),
        };
        data.push(result);
      });
    });
    // const resultComments = activities.map((element) => {
    //   const data = element;

    //   return data.comments.length;
    // });

    res.json(data);
  },

  async createComment(req, res) {
    const { activityId } = req.params;
    const { userId } = req.body;

    if (!req.body.text) {
      throw new ApiError('Le commentaire ne peut être vide', 400);
    }

    let comment = await Comment.create({
      text: req.body.text,
      user_id: userId,
      activity_id: activityId,
    });

    const user = await User.findByPk(userId);

    comment = {
      ...comment.get(),
      user: user.get().nickname,
      avatar: `http://localhost:8080/api/user/${userId}/avatar`,
      date: dateFormat.convertActivityDate(comment.get().created_at),
    };

    sseHandlerComments.broadcast(comment, 'comment');

    res.end();
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

  // ne renvoie plus de json, retourne un tableau
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
        },
      ],
      attributes: ['id', 'city'],
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

  // L'utilisateur qui se connecte sur l'appli passera au moins une fois dans cette
  // route
  async getParticipationsInRealTime(req, res) {
    const { id } = req.user;

    const user = await User.findByPk(id, { raw: true });

    if (!user) throw new ApiError('Aucun utilisateur trouvé', 403);

    sseHandlerParticipate.newConnection(id, res);

    let getParticipates = await activity.getParticipations(req);

    if (getParticipates.length === 0) getParticipates = 'null';

    sseHandlerParticipate.broadcast(getParticipates, user.city);

    res.on('close', () => {
      sseHandlerParticipate.closeConnection(id);
    });
  },
};

module.exports = activity;
