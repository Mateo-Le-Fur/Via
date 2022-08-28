/* eslint-disable quote-props */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const { Activity, User } = require('../models');
const ApiError = require('../errors/apiError');
const dateFormat = require('../services/dateFormat');
const SSEHandler = require('../services/SSEHandler');

// On créer une instance du sseHandler avec le nom du salon de communication
const sseHandlerParticipate = new SSEHandler('Participations');
const sseHandlerActivities = new SSEHandler('Activités');

let globalVersionParticipate = 0;

const activity = {

  async getActivities(req, res) {
    const { id } = req.user;

    let getUser = await User.findByPk(id);

    if (!getUser) {
      throw new ApiError('Aucun utilisateur n\'a été trouvée', 400);
    }

    getUser = getUser.get();

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

  async getActivitiesInRealTime(req, res) {
    const { id } = req.user;
    const { city } = req.params;

    let getUser = await User.findByPk(id);

    if (!getUser) {
      throw new ApiError('Aucun utilisateur n\'a été trouvée', 400);
    }

    getUser = getUser.get();

    if (city !== getUser.city) {
      throw new ApiError('Vous ne pouvez pas voir les activités de cette ville', 403);
    }

    sseHandlerActivities.newConnection(id, res);

    const intervalId = setInterval(async () => {
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

      console.log(result);

      sseHandlerActivities.sendDataToClients(id, result, result[0].city);
    }, 2000);
    res.on('close', () => {
      // On clear l'interval pour éviter de continue à recevoir les infos de l'utilisateur qui est déconnecté
      clearInterval(intervalId);
      // On ferme la connection de l'utilisateur
      sseHandlerActivities.closeConnection(id);
    });
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

    if (id !== parseInt(userId, 10)) {
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

    if (user.dataValues.city !== activity.dataValues.city) {
      throw new ApiError('Vous ne pouvez pas parcitiper à une activité de cette ville', 403);
    }

    await user.addParticipations(activity);

    // Le fait d'incrementer cette variable va permettre au serveur d'envoyer les données en temps réel
    globalVersionParticipate += 1;

    res.status(200).json({ msg: 'Participe' });
  },

  async getParticipationsInRealTime(req, res) {
    const { activityId, city } = req.params;
    const { id } = req.user;

    let localVersion = 0;

    // On récupere les infos de l'utilisateur courrant
    const user = await User.findByPk(id, {
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
        let activity = await Activity.findByPk(activityId, {

          include: ['userParticip'],
          attributes: ['id', 'city'],
          order: [
            ['id', 'asc'],
          ],
          where: {
            city: user.city,
          },
        });

        activity = activity.get();
        const count = activity.userParticip.length;
        const data = {
          ...activity, activityId: activity.id, userId: user.id, count, city: activity.city,
        };

        delete data.userParticip;

        // On envoie les données en passant l'id de l'utilisateur, les datas et la ville qui servira d'event pour le front
        sseHandlerParticipate.sendDataToClients(id, data, data.city);

        // ! info pour le front
        // Côté front il faut récupérer l'utilisateur qui est actuellement connecter sur l'application
        // Il faut ensuite dans l'event listener écouter sur la ville de l'utilisateur actuelle
        /* Si la ville de l'utilisateur actuelle correspond avec la ville contenu dans le tableau
         alors on renvoie les données */
        // Cela permet de renvoyer les données seulement aux utilisateurs de la même ville
        /* Il faut ensuite parcourir le tableau renvoyé et mettre a jour le compteur de chaque activité
        à l'aide des propriétées 'activityId' et 'count' contenu dans le tableau */

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
