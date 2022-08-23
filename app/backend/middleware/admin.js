const ApiError = require('../errors/apiError');

const admin = {

  protect(req, _, next) {
    if (!req.user.is_admin) {
      throw new ApiError('Forbidden', 403);
    }

    next();
  },

};

module.exports = admin;
