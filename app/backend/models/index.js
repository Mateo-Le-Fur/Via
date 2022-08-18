const Activity = require('./Activity');
const Comment = require('./Comment');
const Message = require('./Message');
const Type = require('./Type');
const User = require('./User');

User.hasMany(Activity, {
  foreignKey: 'user_id',
  as: 'activities',
});

Activity.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(Message, {
  foreignKey: 'exp_user_id',
  as: 'messages',
});

Message.belongsTo(User, {
  foreignKey: 'exp_user_id',
  as: 'exp_user',
});

Message.belongsTo(User, {
  foreignKey: 'dest_user_id',
  as: 'dest_user',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  as: 'comments',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Comment.belongsTo(Activity, {
  foreignKey: 'activity_id',
  as: 'activity',
});

Activity.belongsToMany(Type, {
  through: 'activity_has_type',
  foreignKey: 'activity_id',
  otherKey: 'type_id',
  as: 'types',
});

Type.belongsToMany(Activity, {
  through: 'activity_has_type',
  foreignKey: 'type_id',
  otherKey: 'activity_id',
  as: 'activities',
});

User.hasMany(Activity, {
  through: 'user_has_activity',
  foreignKey: 'user_id',
  otherKey: 'activity_id',
  as: 'bookmarks',
});

Activity.belongsToMany(User, {
  through: 'user_has_activity',
  foreignKey: 'activity_id',
  otherKey: 'user_id',
  as: 'users',
});

User.hasMany(Activity, {
  through: 'user_to_activity',
  foreignKey: 'user_id',
  otherKey: 'activity_id',
  as: 'participations',
});

Activity.belongsToMany(User, {
  through: 'user_has_activity',
  foreignKey: 'activity_id',
  otherKey: 'user_id',
  as: 'userParticip',
});

module.exports = {
  Activity, Comment, Message, Type, User,
};
