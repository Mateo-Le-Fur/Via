const path = require('path');
const fs = require('fs');
const { User, Activity } = require('../models');
const getCoordinates = require('../services/getCoordinates');
const ApiError = require('../errors/apiError');
const multerUpload = require('../helpers/multer');
const compressImage = require('../services/compress');

const userController = {

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

    res.json(newUser);
  },

  async updateUser(req, res, next) {
    const { id } = req.params;

    console.log(req.user, id);

    if (req.user.id !== parseInt(id, 10)) {
      throw new ApiError('Forbidden', 403);
    }
    const {
      firstname, lastname, description, address, phone, avatar,
    } = req.body;

    const coordinates = await getCoordinates(address, 'housenumber', next);

    const user = await User.update({
      firstname,
      lastname,
      description,
      address,
      phone,
      avatar,
      lat: coordinates[0],
      long: coordinates[1],
    }, {
      where: {
        id,
      },
    });

    res.json(user);
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      throw new ApiError('Forbidden', 403);
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
      throw new ApiError('Forbidden', 403);
    }

    const {
      name,
      description,
      date,
      address,
      city,
      lat,
      long,
    } = req.body;

    const userActivity = await Activity.update({
      name,
      description,
      date,
      address,
      city,
      lat,
      long,
    }, {
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    res.json(userActivity);
  },

  async createActivity(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    const coordinates = await getCoordinates(`${req.body.address.split(' ').join('+')}+${req.body.city}`, 'street');

    const lat = coordinates[0];
    const long = coordinates[1];

    const newBody = {
      ...req.body, user_id: id, lat, long,
    };

    const activity = await Activity.create(newBody);

    res.json(activity);
  },

  deleteUserActivity(req, res) {
    const { userId, activityId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      throw new ApiError('Forbidden', 403);
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
    const { activityId } = req.body;

    if (req.user.id !== parseInt(userId, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const activity = await Activity.findByPk(activityId);

    if (!activity) {
      throw new ApiError('Activité introuvable', 400);
    }

    await activity.addUser(user);

    user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    res.status(201).json({ msg: 'Activité ajouter au favori' });
  },

  async getUserBookmarks(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    const user = await User.findByPk(id, {
      include: ['bookmarks'],
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    res.json(user.get().bookmarks);
  },

  async deleteUserBookmark(req, res) {
    const { userId, activityId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      throw new ApiError('Forbidden', 403);
    }

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    const activity = await Activity.findByPk(activityId);

    if (!activity) {
      throw new ApiError('Activité introuvable', 400);
    }

    await activity.removeUser(user);

    user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    res.json({ msg: 'favori supprimer' });
  },

  async getUserAvatar(req, res) {
    const { id } = req.params;
    // On recupere un utilisateur
    const user = await User.findByPk(id);

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }

    // On va chercher le chemin de son image
    const pathAvatar = path.join(__dirname, `../${user.avatar}`);
    // On vérifie si elle existe
    const isAvatarExist = fs.existsSync(pathAvatar);

    // Si l'image n'existe pas dans le serveur, ou que le chemin de l'image n'est pas en bdd,
    // alors on renvoie l'image par defaut
    if (!isAvatarExist || !user.avatar) {
      res.sendFile(path.join(__dirname, '../images/default.jpeg'));
      return;
    }

    res.sendFile(pathAvatar);
  },

  async uploadUserAvatar(req, res) {
    const { id } = req.params;

    multerUpload(req, res, async (uploadError) => {
      // Gestion des erreurs possible lors de l'upload d'une image

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
      const user = await User.findByPk(id);
      // l'image prendra comme nouveau nom ce que renvoie Date.now()
      const newImageName = Date.now();

      const isAvatarExist = fs.existsSync(path.join(__dirname, '../', user.avatar));

      // Supression de l'ancienne image de l'utilisateur si elle existe
      if (isAvatarExist) {
        fs.unlink(path.join(__dirname, '../', user.avatar), (unlinkError) => {
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
            id,
          },
        },
      );

      res.json({ message: 'Image envoyée', id });
    });
  },

};

module.exports = userController;
