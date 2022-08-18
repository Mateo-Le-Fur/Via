const { v4: uuidv4 } = require('uuid');
const redis = require('../config/redis');

function generateRedisKey(user, token) {
  const userUUID = uuidv4();
  const newUser = user;

  redis.set(userUUID, token);
  redis.expire(userUUID, process.env.JWT_EXPIRE);

  delete newUser.password;

  return userUUID;
}

module.exports = generateRedisKey;
