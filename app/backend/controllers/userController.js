/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
const path = require("path");
const fs = require("fs");
const { User, Activity, Type, Message } = require("../models");
const getCoordinates = require("../services/getCoordinates");
const ApiError = require("../errors/apiError");
const multerUpload = require("../helpers/multer");
const compressImage = require("../services/compress");
const dateFormat = require("../services/dateFormat");
const SSEHandler = require("../services/SSEHandler");
const extract = require("../services/extractString");
const convertActivityDate = require("../services/dateFormat");

const sseHandlerActivities = new SSEHandler("Activités");
const sseHandlerMessages = new SSEHandler("Messages");

const userController = {
  async getCurrentUser(req, res) {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    delete user.password;

    const val = {
      ...user,
      url: `http://localhost:8080/api/user/${req.user.id}/avatar`,
    };

    res.json(val);
  },

  async getUser(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    const result = {
      ...user,
      url: `http://localhost:8080/api/user/${id}/avatar`,
    };
    const { password, ...rest } = result;

    res.json(rest);
  },

  async updateUser(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const getUser = await User.findByPk(id, {
      raw: true,
    });

    let coordinates;
    let lat = getUser.lat;
    let long = getUser.long;
    if (req.body.address !== getUser.address) {
      coordinates = await getCoordinates(req.body.address, "housenumber");

      if (coordinates) {
        lat = coordinates[0];
        long = coordinates[1];
      }
    }

    let city = extract(req.body.address);

    if (!city) {
      city = getUser.city;
    }

    const newBody = {
      ...req.body,
      lat,
      long,
      city,
    };

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

    const user = {
      ...result,
      url: `http://localhost:8080/api/user/${id}/avatar`,
    };

    const val = {
      message: "Profil mis à jour",
      user,
    };

    delete val.user.password;

    res.json(val);
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const user = await User.destroy({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    res.json("Compte supprimé");
  },

  async getUserActivities(req, res) {
    const { id } = req.params;
    const result = await User.findByPk(id, {
      include: ["activities"],
    });

    if (!result) {
      throw new ApiError("Activité introuvable", 400);
    }
    const user = result.get();

    const activities = user.activities.map((el) => el.get());

    const val = { ...user, activities };

    const { password, ...rest } = val;

    res.json(rest);
  },

  async updateUserActivity(req, res) {
    const { activityId, userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const coordinates = await getCoordinates(
      `${req.body.address.split(" ").join("+")}+${req.body.city}`,
      "street"
    );

    const lat = coordinates[0];
    const long = coordinates[1];

    const newBody = {
      ...req.body,
      user_id: userId,
      lat,
      long,
    };

    await Activity.update(newBody, {
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    const getUpdatedActivity = await Activity.findByPk(activityId, {
      include: ["types", "user"],
    });

    let result = getUpdatedActivity.get();

    const date = dateFormat.convertActivityDate(result.date);

    result = {
      ...result,
      nickname: result.user.nickname,
      type: result.types[0].label,
      date,
    };

    const { types, user, ...rest } = result;

    res.json(rest);
  },

  async createActivity(req, res) {
    const { id } = req.params;

    if (req.user.id !== parseInt(id, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const user = await User.findByPk(req.user.id, {
      raw: true,
    });

    if (!user) {
      throw new ApiError("Uitlisateur introuvable", 400);
    }

    const coordinates = await getCoordinates(
      `${req.body.address.split(" ").join("+")}+${req.body.city}`,
      "street"
    );

    const lat = coordinates[0];
    const long = coordinates[1];

    const type = await Type.findOne({
      where: {
        label: req.body.type,
      },
    });

    const newBody = {
      ...req.body,
      user_id: id,
      lat,
      long,
      city: user.city,
    };

    const date = dateFormat.convertActivityDate(req.body.date);

    const activity = await Activity.create(newBody);

    activity.addTypes(type);

    let result = activity.get();

    result = {
      ...result,
      type: req.body.type,
      nickname: user.nickname,
      date,
    };

    res.json(result);
  },

  async getCreatedActivitiesInRealTime(req, res) {
    const { id } = req.user;
    const { city } = req.params;

    let getUser = await User.findByPk(id);

    if (!getUser) {
      throw new ApiError("Aucun utilisateur n'a été trouvée", 400);
    }

    getUser = getUser.get();

    if (city !== getUser.city) {
      throw new ApiError(
        "Vous ne pouvez pas voir les activités de cette ville",
        403
      );
    }

    sseHandlerActivities.newConnection(id, res);

    const activities = await Activity.findAll({
      include: ["types", "user"],
      where: {
        city: getUser.city,
      },
      limit: 1,
      order: [["created_at", "DESC"]],
    });

    if (!activities) {
      throw new ApiError("Aucune activité n'a été trouvée", 400);
    }

    const result = activities.map((elem) => {
      let data = elem.get();

      const date = dateFormat.convertActivityDate(data.date);

      data = {
        ...data,
        nickname: data.user.nickname,
        type: data.types[0].label,
        date,
      };

      const { types, user, ...rest } = data;

      return rest;
    });

    sseHandlerActivities.sendDataToClients(
      id,
      JSON.stringify(result),
      result[0].city
    );
  },

  deleteUserActivity(req, res) {
    const { userId, activityId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const activity = Activity.destroy({
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    if (!activity) {
      throw new ApiError("Activité introuvable", 400);
    }

    res.status(201).json({ msg: "Activité supprimée" });
  },

  async addBookmark(req, res) {
    const { userId } = req.params;
    let { bookmarkId } = req.body;

    bookmarkId = bookmarkId.toString();

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ["bookmarks"],
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    const activity = await Activity.findByPk(bookmarkId);

    if (!activity) {
      throw new ApiError("Activité introuvable", 400);
    }

    await activity.addUser(user);

    user = await User.findByPk(userId, {
      include: ["bookmarks"],
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
        throw new ApiError("Forbidden", 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ["bookmarks"],
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
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
        throw new ApiError("Forbidden", 403);
      }
    }

    let user = await User.findByPk(userId, {
      include: ["bookmarks"],
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    const activity = await Activity.findByPk(bookmarkId);

    if (!activity) {
      throw new ApiError("Activité introuvable", 400);
    }

    await activity.removeUser(user);

    user = await User.findByPk(userId, {
      include: ["bookmarks"],
    });

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

  async getUserMessagesSSE(req, res) {
    const { id } = req.user;

    sseHandlerMessages.newConnection(id, res);

    res.on("close", () => {
      sseHandlerMessages.closeConnection(id);
    });
  },

  async getUserMessages(req, res) {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const userMessages = [];

    const sentMessages = await Message.findAll({
      where: {
        exp_user_id: userId,
      },
      include: ["dest_user"],
    });

    sentMessages.forEach((message) => {
      const newMessage = {
        ...message.get(),
        user: message.dest_user.nickname,
        avatar: `http://localhost:8080/api/user/${message.dest_user.id}/avatar`,
        date: dateFormat.convertActivityDate(message.get().created_at),
      };

      delete newMessage.dest_user;

      userMessages.push(newMessage);
    });

    const receivedMessages = await Message.findAll({
      where: {
        dest_user_id: userId,
      },
      include: ["exp_user"],
    });

    receivedMessages.forEach((message) => {
      const newMessage = {
        ...message.get(),
        user: message.exp_user.nickname,
        avatar: `http://localhost:8080/api/user/${message.exp_user.id}/avatar`,
        date: dateFormat.convertActivityDate(message.get().created_at),
      };

      delete newMessage.exp_user;

      userMessages.push(newMessage);
    });

    res.json(userMessages);
  },

  async createMessage(req, res) {
    const { userId } = req.params;
    const { recipientId, message } = req.body;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    let newMessage = await Message.create({
      message,
      exp_user_id: userId,
      dest_user_id: recipientId,
    });

    const user = await User.findByPk(userId);

    newMessage = {
      ...newMessage.get(),
      user: user.get().nickname,
      avatar: `http://localhost:8080/api/user/${userId}/avatar`,
      date: dateFormat.convertActivityDate(newMessage.get().created_at),
    };

    const clients = [userId, recipientId];

    sseHandlerMessages.multicast(clients, newMessage, "Messages");

    res.json({ message: "sent!" });
  },

  async deleteMessage(req, res) {
    const { userId, messageId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    const message = await Message.findByPk(messageId);

    if (!message) {
      throw new ApiError("Message introuvable", 400);
    }

    await message.destroy();

    res.json({ msg: "Message supprimé" });
  },

  async getUserAvatar(req, res) {
    const { userId } = req.params;
    // On recupere un utilisateur
    const user = await User.findByPk(userId, {
      raw: true,
    });

    if (!user) {
      throw new ApiError("Utilisateur introuvable", 400);
    }

    // On va chercher le chemin de son image
    const pathAvatar = path.join(__dirname, `../../${user.avatar}`);
    // On vérifie si elle existe
    const isAvatarExist = fs.existsSync(pathAvatar);

    // Si l'image n'existe pas dans le serveur, ou que le chemin de l'image n'est pas en bdd,
    // alors on renvoie l'image par defaut
    if (!isAvatarExist || !user.avatar) {
      res.sendFile(path.join(__dirname, "../../images/default.webp"));
      return;
    }

    res.sendFile(pathAvatar);
  },

  async uploadUserAvatar(req, res) {
    const { userId } = req.params;

    if (req.user.id !== parseInt(userId, 10)) {
      if (!req.user.is_admin) {
        throw new ApiError("Forbidden", 403);
      }
    }

    multerUpload(req, res, async (uploadError) => {
      // Gestion des erreurs possible lors de l'upload d'une image

      try {
        if (uploadError) {
          if (uploadError.code === "LIMIT_FILE_SIZE") {
            throw new ApiError("Image trop volumineuse", 400);
          }
          throw new ApiError(uploadError.message, 400);
        }
        // Si pas de fichier dans la requete cela veut dire que l'utilisateur
        // n'a pas sélectionner d'image
        if (!req.file) {
          throw new ApiError("Aucune Image sélectionnée", 400);
        }

        // On récupére le chemin de l'utilisateur en BDD
        const user = await User.findByPk(userId, {
          raw: true,
        });

        // l'image prendra comme nouveau nom ce que renvoie Date.now()
        const newImageName = Date.now();

        if (user.avatar === null) {
          user.avatar = "empty";
        }

        const isAvatarExist = fs.existsSync(
          path.join(__dirname, "../../", user.avatar)
        );

        // Supression de l'ancienne image de l'utilisateur si elle existe
        if (isAvatarExist) {
          fs.unlink(
            path.join(__dirname, "../../", user.avatar),
            (unlinkError) => {
              if (unlinkError) throw unlinkError;
            }
          );
        }

        // Compression de la nouvelle image si son poids est supérieur a 100kB

        compressImage(req, newImageName);

        // upload de la nouvelle image
        await User.update(
          {
            avatar: `/images/${newImageName}.webp`,
          },
          {
            where: {
              id: userId,
            },
          }
        );
        res.json({ message: "Image envoyée", userId });
      } catch (error) {
        console.error(error);
      }
    });
  },
};
module.exports = userController;
