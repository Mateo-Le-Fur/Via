const jwt = require('jsonwebtoken');
const client = require('../config/redis');

const authJWT = {

  async protect(req, res, next) {
    const { tokenId } = req.cookies;

    const token = await client.get(tokenId);

    if (!token) {
      res.status(401).json('Aucun token trouvé');
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        res.status(403).json({ msg: 'Token invalide' });
        return;
      }

      next();
    });
  },
};

module.exports = authJWT;
