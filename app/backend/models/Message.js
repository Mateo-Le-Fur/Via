const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Message extends Model {}

Message.init({
  message: {
    type: Datatypes.STRING,
    allowNull: false
  },
  exp_user_id: Datatypes.INTEGER,
  dest_user_id: Datatypes.INTEGER
}, {
  sequelize,
  tableName: 'message',
});

module.exports = Message;
