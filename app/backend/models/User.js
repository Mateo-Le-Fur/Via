const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model { }

User.init({
  email: {
    type: Datatypes.STRING,
    allowNull: false
  },
  password: {
    type: Datatypes.STRING,
    allowNull: false
  },
  nickname: {
    type: Datatypes.STRING,
    allowNull: false
  },
  firstname: Datatypes.STRING,
  lastname: Datatypes.STRING,
  description: Datatypes.STRING,
  address: Datatypes.STRING,
  city: Datatypes.STRING,
  phone: Datatypes.STRING,
  avatar: Datatypes.STRING,
  is_admin: Datatypes.BOOLEAN,
}, {
  sequelize,
  tableName: 'user',
});

module.exports = User;
