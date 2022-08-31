const ApiError = require('../errors/apiError');

module.exports = (prop, schema) => async (request, res, next) => {
  try {
    await schema.validateAsync(request[prop], {
      allowUnknow: true,
    });
    next();
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};
