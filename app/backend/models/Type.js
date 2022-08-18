const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Type extends Model {}

Type.init({
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'type',
});

module.exports = Type;
