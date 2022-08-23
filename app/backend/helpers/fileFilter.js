module.exports = function fileFilter(req, file, cb) {
  if ((file.mimetype !== 'image/jpeg'
      && file.mimetype !== 'image/png'
      && file.mimetype !== 'image/svg+xml'
      && file.mimetype !== 'image/jpg'
  )) {
    return cb(new Error('Format non accepté'));
  }
  return cb(null, true);
};
