/* eslint-disable quote-props */
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

    await user.addParticipations(activity);

    // Le fait d'incrementer cette variable va permettre au serveur d'envoyer les données en temps réel
    globalVersion += 1;

    res.status(200).json({ msg: 'Participe' });
  },

  async getParticipationsInRealTime(req, res) {
    const { id } = req.user;
    let localVersion = 0;

    // On récupere le sseHandler
    const sseHandler = req.app.get('sseHandler');

    // On initialise une connexion avec l'id de l'utilisateur courrant
    sseHandler.newConnection(id, res);

    // On récupere les infos de l'utilisateur courrant
    const user = await User.findByPk(id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    setInterval(async () => {
      // On va chercher toutes les activités dans la ville de l'utilisateur courrant
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

      // Le localVersion et globalVersion permette d'envoyer les datas seulement quand il le faut
      // sinon par defaut le serveur va envoyer les datas en continue en fonction du timer dans le setInterval
      if (localVersion < globalVersion) {
        const result = activity.map((elem) => {
          const count = elem.userParticip.length;
          return {
            activityId: elem.id, count, city: elem.city,
          };
        });

        // On envoie les données en passant
        sseHandler.sendDataToClients(id, result, result[0].city);

        // ! info pour le front
        // Côté front il faut récupérer l'utilisateur qui est actuellement connecter sur l'application
        // Il faut ensuite dans l'event listener écouter sur la ville de l'utilisateur actuelle
        /* Si la ville de l'utilisateur actuelle correspond avec la ville contenu dans le tableau
         alors on renvoie les données */
        // Cela permet de renvoyer les données seulement aux utilisateurs de la même ville
        /* Il faut ensuite parcourir le tableau renvoyé et mettre a jour le compteur de chaque activité
        à l'aide des propriétées 'activityId' et 'count' contenu dans le tableau */

        // Cela permet de close l'interval jusqu'a ce qu'un autre utilisateur participe a une activité
        localVersion = globalVersion;
      }
    }, 10);

    // On close la connextion lorsque q'un utilisateur ferme son naviguateur
    res.on('close', () => {
      sseHandler.closeConnection(id);
    });
  },
};

module.exports = activity;
