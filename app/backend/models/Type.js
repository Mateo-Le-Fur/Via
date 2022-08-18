const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Type extends Model {}

Type.init({
  label: {
    type: Datatypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'type',
});

module.exports = Type;
