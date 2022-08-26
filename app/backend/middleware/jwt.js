const jwt = require('jsonwebtoken');
const ApiError = require('../errors/apiError');
const redis = require('../config/redis');

const authJWT = {

  async protect(req, res, next) {
    const { token } = req.signedCookies;

    try {
      if (!token) {
        throw new ApiError('Vous devez être connecté', 403);
      }

      const isTokenBlackListed = await redis.get(token);

      if (isTokenBlackListed) {
        throw new ApiError('Token invalide', 403);
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          throw new ApiError('Veuillez vous reconneter', 403);
        }

        req.user = { ...user, token };
        next();
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authJWT;
