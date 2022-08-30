/* eslint-disable object-curly-newline */
/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { Activity, User, Type } = require('../models');
const ApiError = require('../errors/apiError');
const dateFormat = require('../services/dateFormat');
const SSEHandler = require('../services/SSEHandler');
const sequelize = require('../config/sequelize');

// On créer une instance du sseHandler avec le nom du salon de communication
const sseHandlerParticipate = new SSEHandler('Participations');

let globalVersionParticipate = 0;

const activity = {

  url: 'http://localhost:8080',

  async getActivities(req, res) {
    const { id } = req.user;

    const getUser = await User.findByPk(id, {
      raw: true,
      attributes: ['city'],
    });

    if (!getUser) {
      throw new ApiError('Aucun utilisateur n\'a été trouvée', 400);
    }

    let activities = await Activity.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['nickname'],
      },
      {
        model: Type,
        as: 'types',
        attributes: ['label'],
      }],
      where: {
        city: getUser.city,
      },
      attributes: {
        include: ['user.nickname', 'types.label', [sequelize.literal('label'), 'type']],

      },
      raw: true,
      nest: true,
    });

    if (!activities) {
      throw new ApiError('Aucune activité n\'a été trouvée', 400);
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
        include: [
          'types.label',
          [sequelize.literal('label'), 'type'],
        ],
      },

    });

    if (!activity) {
      throw new ApiError(`L'activité portant l'id ${id} n'existe pas`, 400);
    }

    activity = activity.get();
    const getUser = activity.user.get();

    const date = dateFormat.convertActivityDate(activity);

    const result = { ...getUser, userDescription: getUser.description, userAddress: getUser.address };

    activity = { ...result, ...activity, date, url: `http://localhost:8080/api/user/${getUser.id}/avatar` };

    const { user, types, ...rest } = activity;

    res.json(rest);
  },

  async participateToActivity(req, res) {
    const { userId } = req.params;
    const { activityId } = req.body;
    const { id } = req.user;

    if (id !== parseInt(userId, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    const activity = await Activity.findByPk(activityId, {
      attributes: ['id', 'city'],
    });

    if (!activity) {
      throw new ApiError('Aucune activité trouvé', 400);
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: Activity,
        as: 'participations',
        attributes: ['id'],
      }],
    });

    if (!user) {
      throw new ApiError('Aucune utilisateur trouvé', 400);
    }

    if (user.dataValues.city !== activity.dataValues.city) {
      throw new ApiError('Vous ne pouvez pas parcitiper à une activité de cette ville', 403);
    }

    await user.addParticipations(activity);

    // Le fait d'incrementer cette variable va permettre au serveur d'envoyer les données en temps réel
    globalVersionParticipate += 1;

    res.status(200).json({ msg: 'Participe' });
  },

  async getParticipations(req, res) {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      attributes: ['city'],
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    let activity = await Activity.findAll({
      include: [{
        model: User,
        as: 'userParticip',
        attributes: ['id'],
      }],
      attributes: ['id', 'city'],
      order: [
        ['id', 'asc'],
      ],
      where: {
        city: user.city,
      },
    });

    activity = activity.map((element) => {
      let data = element.get();
      const count = data.userParticip.length;
      data = {
        ...data, count,
      };
      delete data.userParticip;

      return data;
    });

    res.json(activity);
  },

  async getParticipationsInRealTime(req, res) {
    const { city } = req.params;
    const { id } = req.user;

    let localVersion = 0;

    // On récupere les infos de l'utilisateur courrant
    const user = await User.findByPk(id, {
      attributes: ['city'],
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    // On empêche l'utilisateur d'accéder aux participations d'une activité qui est dans une autre ville
    // que la sienne
    if (user.city !== city) {
      throw new ApiError('Vous ne pouvez pas obtenir les informations de cette ville', 403);
    }

    // On initialise une connexion avec l'id de l'utilisateur courrant
    sseHandlerParticipate.newConnection(id, res);

    const intervalId = setInterval(async () => {
      // Le localVersion et globalVersion permette d'envoyer les datas seulement quand il le faut
      // sinon par defaut le serveur va envoyer les datas en continue en fonction du timer dans le setInterval
      if (localVersion < globalVersionParticipate) {
        // On va chercher toutes les activités dans la ville de l'utilisateur courrant
        let activity = await Activity.findAll({
          include: [{
            model: User,
            as: 'userParticip',
            attributes: ['id'],
          }],
          attributes: ['id', 'city'],
          order: [
            ['id', 'asc'],
          ],
          where: {
            city: user.city,
          },
        });

        activity = activity.map((element) => {
          let data = element.get();
          const count = data.userParticip.length;
          data = {
            ...data, count,
          };
          delete data.userParticip;

          return data;
        });

        // On envoie les données en passant l'id de l'utilisateur, les datas et la ville qui servira d'event pour le front
        sseHandlerParticipate.sendDataToClients(id, activity, activity[0].city);

        // Cela permet de close l'interval jusqu'a ce qu'un autre utilisateur participe a une activité
        localVersion = globalVersionParticipate;
      }
    }, 10);

    res.on('close', () => {
      // On clear l'interval pour éviter de continue à recevoir les infos de l'utilisateur qui est déconnecté
      clearInterval(intervalId);
      // On ferme la connection de l'utilisateur
      sseHandlerParticipate.closeConnection(id);
    });
  },
};

module.exports = activity;
