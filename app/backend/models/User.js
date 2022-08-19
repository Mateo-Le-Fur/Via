const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  firstname: {
    type: DataTypes.TEXT,
  },

  lastname: DataTypes.TEXT,

  description: DataTypes.TEXT,

  address: DataTypes.TEXT,

  city: DataTypes.TEXT,

  phone: DataTypes.TEXT,

  avatar: DataTypes.TEXT,

  lat: DataTypes.TEXT,

  long: DataTypes.TEXT,

  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: 'user',
});

module.exports = User;
