const ApiError = require('../errors/apiError');

const admin = {

  protect(req) {
    if (!req.user.is_admin) {
      throw new ApiError('Forbidden', 403);
    }
  },

};

module.exports = admin;
