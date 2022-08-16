const { Model, Sequelize } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model {}

User.init({
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  nickname: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  description: Sequelize.STRING,
  address: Sequelize.STRING,
  city: Sequelize.STRING,
  phone: Sequelize.STRING,
  avatar: Sequelize.STRING,
  is_admin: Sequelize.BOOLEAN,
}, {
  sequelize,
  tableName: 'user',
});

module.exports = User;
