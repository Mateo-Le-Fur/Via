const { User, Activity } = require('../models');
const getCoordinates = require('../services/getCoordinates');

const userController = {

  async getUser(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    res.json(user);
  },

  async updateUser(req, res) {
    const { id } = req.params;
    const {
      firstname, lastname, description, address, phone, avatar,
    } = req.body;

    const user = await User.update({
      firstname,
      lastname,
      description,
      address,
      phone,
      avatar,
    }, {
      where: id,
    });

    res.json(user);
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    const user = await User.destroy({
      where: id,
    });

    res.json(user);
  },

  async getUserActivities(req, res) {
    const { id } = req.params;
    const result = await User.findByPk(id, {
      include: ['activities'],
    });

    const user = result.get();

    const activities = user.activities.map((el) => el.get());

    const val = { ...user, activities };

    res.json(val);
  },

  async updateUserActivity(req, res) {
    const { activityId, userId } = req.params;
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

    const coordinates = await getCoordinates(`${req.body.address.split(' ').join('+')}+${req.body.city}`, 'street');

    const lat = coordinates[1];
    const long = coordinates[0];

    const newBody = {
      ...req.body, user_id: id, lat, long,
    };

    const activity = await Activity.create(newBody);

    res.json(activity);
  },

  deleteUserActivity(req, res) {
    const { userId, activityId } = req.params;

    Activity.destroy({
      where: {
        id: activityId,
        user_id: userId,
      },
    });

    res.status(201).json({ msg: 'ok' });
  },

  async addBookmark(req, res) {
    const { userId } = req.params;
    const { activityId } = req.body;

    let user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    const activity = await Activity.findByPk(activityId);

    await activity.addUser(user);

    user = await User.findByPk(userId, {
      include: ['bookmarks'],
    });

    res.json({ msg: 'ok' });
  },

  async getBookmark(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: ['bookmarks'],
    });

    res.json(user.get().bookmarks);
  },

};

module.exports = userController;
