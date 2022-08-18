const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Activity extends Model {}

Activity.init({
  name: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  description: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  date: {
    type: Datatypes.TIMESTAMPTZ,
    allowNull: false,
  },
  address: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  city: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  lat: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  long: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  user_id: Datatypes.INTEGER,
}, {
  sequelize,
  tableName: 'activity',
});

module.exports = Activity;
