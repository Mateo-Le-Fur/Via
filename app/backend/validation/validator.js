module.exports = (prop, schema) => async (request, res, next) => {
  try {
    await schema.validateAsync(request[prop]);
    next();
  } catch (error) {
    res.json({ msg: error.message.toString() });
  }
};
