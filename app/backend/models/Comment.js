const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Comment extends Model {}

Comment.init({
  text: {
    type: Datatypes.STRING,
    allowNull: false
  },
  user_id: Datatypes.INTEGER,
  activity_id: Datatypes.INTEGER
}, {
  sequelize,
  tableName: 'comment',
});

module.exports = Comment;
