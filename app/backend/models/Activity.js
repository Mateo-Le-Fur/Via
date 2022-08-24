const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Activity extends Model {}

Activity.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  long: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  user_id: DataTypes.INTEGER,
}, {
  sequelize,
  tableName: 'activity',
});

module.exports = Activity;
