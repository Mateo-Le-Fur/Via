const { User, Activity, Type, Message, Comment } = require('../models');

const dashboard = {
  async getAllData(req, res) {
    const users = User.findAll();
    const activities = User.findAll();
    const types = User.findAll();
    const messages = User.findAll();
    const comments = User.findAll();

    const allData = [
      users,
      activities,
      types,
      messages,
      comments
    ];

    const data = await Promise.all(allData);

    res.json({data});
  },

  async updateUser(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));

    if (!user) {
      res.json(`Cet utilisateur n'existe pas`);
      return;
    }

    await user.update(req.body);
    res.status(200).json(user);
  },

  async deleteUSer(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(Number(id));

    if (!user) {
      res.json(`Cet utilisateur n'existe pas`);
      return;
    }

    await user.destroy();
    res.status(204).json('Utilisateur supprimé !');
  },

  async updateActivity(req, res) {
    const { id } = req.params;
    const activity = await Activity.findByPk(Number(id));

    if (!activity) {
      res.json(`Cette activité n'existe pas`);
      return;
    }

    await activity.update(req.body);
    res.status(200).json(activity);
  },

  async deleteActivity(req, res) {
    const { id } = req.params;
    const activity = await Activity.findByPk(Number(id));

    if (!activity) {
      res.json(`Cette activité n'existe pas`);
      return;
    }

    await activity.destroy();
    res.status(204).json('Activité supprimée !');
  },

  async createType(req, res) {
    const type = await Type.create(req.body);

    if (!req.body.label) {
      res.status(400).json({ msg: 'Le label du type ne peut être vide !' });
      return;
    }

    res.status(201).json(type);
  },

  async updateType(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(Number(id));

    if (!type) {
      res.json(`Ce type n'existe pas`);
      return;
    }

    await type.update(req.body);
    res.status(200).json(type);
  },

  async deleteType(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(Number(id));

    if (!type) {
      res.json(`Ce type n'existe pas`);
      return;
    }

    await type.destroy();
    res.status(204).json('Type supprimé !');
  },

  async updateMessage(req, res) {
    const { id } = req.params;
    const message = await Message.findByPk(Number(id));

    if (!message) {
      res.json(`Ce message n'existe pas`);
      return;
    }

    await message.update(req.body);
    res.status(200).json(message);
  },

  async deleteMessage(req, res) {
    const { id } = req.params;
    const message = await Message.findByPk(Number(id));

    if (!message) {
      res.json(`Ce message n'existe pas`);
      return;
    }

    await message.destroy();
    res.status(204).json('Message supprimé !');
  },

  async updateComment(req, res) {
    const { id } = req.params;
    const comment = await Comment.findByPk(Number(id));

    if (!comment) {
      res.json(`Ce commentaire n'existe pas`);
      return;
    }

    await comment.update(req.body);
    res.status(200).json(comment);
  },

  async deleteComment(req, res) {
    const { id } = req.params;
    const comment = await Comment.findByPk(Number(id));

    if (!comment) {
      res.json(`Ce commentaire n'existe pas`);
      return;
    }

    await comment.destroy();
    res.status(204).json('Commentaire supprimé !');
  }
}

module.exports = dashboard;
