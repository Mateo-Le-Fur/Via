const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Message extends Model {}

Message.init({
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exp_user_id: DataTypes.INTEGER,
  dest_user_id: DataTypes.INTEGER,
}, {
  sequelize,
  tableName: 'message',
});

module.exports = Message;
