const ApiError = require('../errors/apiError');

const {
  User, Activity, Type, Message, Comment,
} = require('../models');

const dashboard = {
  async getAllData(req, res) {
    const users = await User.findAll();
    const activities = await Activity.findAll();
    const types = await Type.findAll();
    const messages = await Message.findAll();
    const comments = await Comment.findAll();

    // const data = await Promise.all(allData);

    res.json({
      users, activities, types, messages, comments,
    });
  },

  async updateUser(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));

    if (!user) {
      throw new ApiError('Cet utilisateur n\'existe pas', 400);
    }

    await user.update(req.body);
    res.status(200).json(user);
  },

  async deleteUSer(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));

    if (!user) {
      throw new ApiError('Cet utilisateur n\'existe pas', 400);
    }

    await user.destroy();
    res.status(204).json('Utilisateur supprimé !');
  },

  async updateActivity(req, res) {
    const { id } = req.params;
    const activity = await Activity.findByPk(Number(id));

    if (!activity) {
      throw new ApiError('Cette activité n\'existe pas', 400);
    }

    await activity.update(req.body);
    res.status(200).json(activity);
  },

  async deleteActivity(req, res) {
    const { id } = req.params;
    const activity = await Activity.findByPk(Number(id));

    if (!activity) {
      throw new ApiError('Cette activité n\'existe pas', 400);
    }

    await activity.destroy();
    res.status(204).json('Activité supprimée !');
  },

  async createType(req, res) {
    const type = await Type.create(req.body);

    if (!req.body.label) {
      throw new ApiError('Le label du type ne peut être vide !', 400);
    }

    res.status(201).json(type);
  },

  async updateType(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(Number(id));

    if (!type) {
      throw new ApiError('Ce type n\'existe pas', 400);
    }

    await type.update(req.body);
    res.status(200).json(type);
  },

  async deleteType(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(Number(id));

    if (!type) {
      throw new ApiError('Ce type n\'existe pas', 400);
    }

    await type.destroy();
    res.status(204).json('Type supprimé !');
  },

  async updateMessage(req, res) {
    const { id } = req.params;
    const message = await Message.findByPk(Number(id));

    if (!message) {
      throw new ApiError('Ce message n\'existe pas', 400);
    }

    await message.update(req.body);
    res.status(200).json(message);
  },

  async deleteMessage(req, res) {
    const { id } = req.params;
    const message = await Message.findByPk(Number(id));

    if (!message) {
      throw new ApiError('Ce message n\'existe pas', 400);
    }

    await message.destroy();
    res.status(204).json('Message supprimé !');
  },

  async updateComment(req, res) {
    const { id } = req.params;
    const comment = await Comment.findByPk(Number(id));

    if (!comment) {
      throw new ApiError('Ce commentaire n\'existe pas', 400);
    }

    await comment.update(req.body);
    res.status(200).json(comment);
  },

  async deleteComment(req, res) {
    const { id } = req.params;
    const comment = await Comment.findByPk(Number(id));

    if (!comment) {
      throw new ApiError('Ce commentaire n\'existe pas', 400);
    }

    await comment.destroy();
    res.status(204).json('Commentaire supprimé !');
  },
};

module.exports = dashboard;
