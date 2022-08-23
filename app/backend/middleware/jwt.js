const jwt = require('jsonwebtoken');
const ApiError = require('../errors/apiError');
// const redis = require('../config/redis');

const authJWT = {

  async protect(req, res, next) {
    const { token } = req.signedCookies;

    if (!token) {
      throw new ApiError('Token inexistant', 403);
    }

    // const token = await redis.get(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new ApiError('Token invalide', 403);
      }

      req.user = { ...user, token };
      next();
    });
  },
};

module.exports = authJWT;
