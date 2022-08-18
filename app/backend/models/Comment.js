const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Comment extends Model {}

Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: DataTypes.INTEGER,
  activity_id: DataTypes.INTEGER,
}, {
  sequelize,
  tableName: 'comment',
});

module.exports = Comment;
