const { User, Activity } = require('../models');

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
    const { userId, activityId } = req.params;
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
      userId,

    }, {
      where: activityId,
    });

    console.log(userActivity);

    res.json(userActivity);
  },
};

module.exports = userController;
