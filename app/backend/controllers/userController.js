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

};

module.exports = userController;
