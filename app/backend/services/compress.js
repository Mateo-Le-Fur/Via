const sharp = require('sharp');
const path = require('path');

module.exports = function compressImage(req, imageName) {
  sharp(req.file.path).resize(400, 400).jpeg({
    quality: 80,
  }).toFile(path.join(__dirname, '../images', `${imageName}.jpeg`), (e) => {
    if (e) {
      console.error(e);
    }
  });
};
