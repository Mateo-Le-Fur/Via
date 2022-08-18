const User = require('../models/User');

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

    console.log(result.get());

    // const user = result.get();

    // const activities = user.activities.map((elem) => {

    // });

    // const eval = { ...tag, quizList: quizzes };
  },
};

module.exports = userController;
