const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const authJWT = {

  async protect(req, res, next) {
    const { tokenId } = req.cookies;

    if (Object.entries(tokenId).length === 0) {
      res.status(401).json({ msg: 'Le token n\'existe pas' });
      return;
    }

    const token = await redis.get(tokenId);

    if (!token) {
      res.status(401).json('Aucun token trouvé');
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ msg: 'Token invalide' });
        return;
      }

      // eslint-disable-next-line no-param-reassign
      delete user.password;

      req.user = { ...user, token };
      next();
    });
  },
};

module.exports = authJWT;
