/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
const path = require('path');
const fs = require('fs');
const { User, Activity, Type } = require('../models');
const getCoordinates = require('../services/getCoordinates');
const ApiError = require('../errors/apiError');
const multerUpload = require('../helpers/multer');
const compressImage = require('../services/compress');
const dateFormat = require('../services/dateFormat');
const SSEHandler = require('../services/SSEHandler');

const sseHandlerActivities = new SSEHandler('Activités');

let globalVersion = 0;

const userController = {

  async getCurrentUser(req, res) {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const val = { ...user, url: `http://localhost:8080/api/user/${req.user.id}/avatar` };

    res.json(val);
  },

  async getUser(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const {
      // eslint-disable-next-line camelcase
      password, is_admin, created_at, updated_at, ...newUser
    } = user.dataValues;

    const val = { ...newUser, url: `http://localhost:8080/api/user/${id}/avatar` };

    res.json(val);
  },

  async updateUser(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const getUser = await User.findByPk(id, {
      raw: true,
    });

    let coordinates;
    let lat = getUser.lat;
    let long = getUser.long;
    if (req.body.address !== getUser.address) {
      coordinates = await getCoordinates(req.body.address, 'housenumber');

      if (coordinates) {
        lat = coordinates[0];
        long = coordinates[1];
      }
    }

    const newBody = { ...req.body, lat, long };

    if (!newBody.phone) {
      newBody.phone = getUser.phone;
    }

    const updatedUser = await User.update(newBody, {
      where: {
        id,
      },
      returning: true,
      plain: true,

    });

    const result = updatedUser[1].get();

    const user = { ...result, url: `http://localhost:8080/api/user/${id}/avatar` };

    const val = {
      message: 'Profil mis à jour',
      user,
    };

    delete val.user.password;

    res.json(val);
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const user = await User.destroy({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    res.json(user);
  },

  async getUserActivities(req, res) {
    const { id } = req.params;
    const result = await User.findByPk(id, {
      include: ['activities'],
    });

    if (!result) {
      throw new ApiError('Activité introuvable', 400);
    }
    const user = result.get();

    const activities = user.activities.map((el) => el.get());

    const val = { ...user, activities };

    res.json(val);
  },

  async updateUserActivity(req, res) {
    const { activityId, userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const coordinates = await getCoordinates(`${req.body.address.split(' ').join('+')}+${req.body.city}`, 'street');

    const lat = coordinates[0];
    const long = coordinates[1];

    const newBody = {
      ...req.body, user_id: userId, lat, long,
    };

    await Activity.update(newBody, {
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    const getUpdatedActivity = await Activity.findByPk(activityId, {
      include: ['types', 'user'],

    });

    let result = getUpdatedActivity.get();

    const date = dateFormat.convertActivityDate(result);

    result = {
      ...result, nickname: result.user.nickname, type: result.types[0].label, date,
    };

    const { types, user, ...rest } = result;

    res.json(rest);
  },

  async createActivity(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const user = await User.findByPk(req.user.id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError('Uitlisateur introuvable', 400);
    }

    const coordinates = await getCoordinates(`${req.body.address.split(' ').join('+')}+${req.body.city}`, 'street');

    const lat = coordinates[0];
    const long = coordinates[1];

    const type = await Type.findOne({
      where: {
        label: req.body.type,
      },
    });

    const newBody = {
      ...req.body, user_id: id, lat, long, city: user.city,
    };

    const activity = await Activity.create(newBody);

    activity.addTypes(type);

    let result = activity.get();

    result = { ...result, type: req.body.type, nickname: user.nickname };

    globalVersion += 1;

    res.json(result);
  },

  async getCreatedActivitiesInRealTime(req, res) {
    const { id } = req.user;
    const { city } = req.params;

    let localVersion = 0;

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
      if (localVersion < globalVersion) {
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
        sseHandlerActivities.sendDataToClients(id, JSON.stringify(result), result[0].city);

        localVersion = globalVersion;
      }
    }, 10);
    res.on('close', () => {
      clearInterval(intervalId);
      sseHandlerActivities.closeConnection(id);
    });
  },

  deleteUserActivity(req, res) {
    const { userId, activityId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const activity = Activity.destroy({
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    if (!activity) {
      throw new ApiError('Activité introuvable', 400);
    }

    res.status(201).json({ msg: 'Activité supprimer' });
  },

  async addBookmark(req, res) {
    const { userId } = req.params;
    let { bookmarkId } = req.body;

    bookmarkId = bookmarkId.toString();

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const activity = await Activity.findByPk(bookmarkId);

    if (!activity) {
      throw new ApiError('Activité introuvable', 400);
    }

    await activity.addUser(user);

    user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    user = user.get();

    const getActivity = user.bookmarks.map((el) => {
      const data = el.get();
      const { user_has_activity, ...rest } = data;
      return rest;
    });

    const { bookmarks, password, ...rest } = user;

    const val = { ...rest, activity: getActivity };

    res.status(201).json(val);
  },

  async getUserBookmarks(req, res) {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    user = user.get();

    const activity = user.bookmarks.map((el) => {
      const data = el.get();
      const { user_has_activity, ...rest } = data;
      return rest;
    });

    const { bookmarks, password, ...rest } = user;

    const val = { ...rest, activity };

    res.json(val);
  },

  async deleteUserBookmark(req, res) {
    const { userId, bookmarkId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],

    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const activity = await Activity.findByPk(bookmarkId);

    if (!activity) {
      throw new ApiError('Activité introuvable', 400);
    }

    await activity.removeUser(user);

    user = user.get();

    const getActivity = user.bookmarks.map((el) => {
      const data = el.get();
      const { user_has_activity, ...rest } = data;
      return rest;
    });

    const { bookmarks, password, ...rest } = user;

    const val = { ...rest, activity: getActivity };

    res.json(val);
  },

  async getUserAvatar(req, res) {
    // On recupere un utilisateur
    const user = await User.findByPk(req.user.id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    // On va chercher le chemin de son image
    const pathAvatar = path.join(__dirname, `../../${user.avatar}`);
    // On vérifie si elle existe
    const isAvatarExist = fs.existsSync(pathAvatar);

    // Si l'image n'existe pas dans le serveur, ou que le chemin de l'image n'est pas en bdd,
    // alors on renvoie l'image par defaut
    if (!isAvatarExist || !user.avatar) {
      res.sendFile(path.join(__dirname, '../../images/default.png'));
      return;
    }

    res.sendFile(pathAvatar);
  },

  async uploadUserAvatar(req, res) {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError('Forbidden', 403);
      }
    }

    multerUpload(req, res, async (uploadError) => {
      // Gestion des erreurs possible lors de l'upload d'une image

      try {
        if (uploadError) {
          if (uploadError.code === 'LIMIT_FILE_SIZE') {
            throw new ApiError('Image trop volumineuse', 400);
          }
          throw new ApiError(uploadError.message, 400);
        }
        // Si pas de fichier dans la requete cela veut dire que l'utilisateur
        // n'a pas sélectionner d'image
        if (!req.file) {
          throw new ApiError('Aucune Image sélectionnée', 400);
        }

        // On récupére le chemin de l'utilisateur en BDD
        const user = await User.findByPk(userId, {
          raw: true,
        });

        // l'image prendra comme nouveau nom ce que renvoie Date.now()
        const newImageName = Date.now();

        if (user.avatar === null) {
          user.avatar = 'vide';
        }

        const isAvatarExist = fs.existsSync(path.join(__dirname, '../../', user.avatar));

        // Supression de l'ancienne image de l'utilisateur si elle existe
        if (isAvatarExist) {
          fs.unlink(path.join(__dirname, '../../', user.avatar), (unlinkError) => {
            if (unlinkError) throw unlinkError;
          });
        }

        // Compression de la nouvelle image si son poids est supérieur a 100kB

        compressImage(req, newImageName);

        // upload de la nouvelle image
        await User.update(
          {
            avatar: `/images/${newImageName}.jpeg`,
          },
          {
            where: {
              id: userId,
            },
          },
        );

        res.json({ message: 'Image envoyée', userId });
      } catch (error) {
        console.error(error);
      }
    });
  },

};
module.exports = userController;
