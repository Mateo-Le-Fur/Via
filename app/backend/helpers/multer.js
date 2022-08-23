const multer = require('multer');
const fileFilter = require('./fileFilter');

const storage = multer.diskStorage({
  // On indique a multer le nom du dossier où il faut insérer les images
  destination: (req, file, cb) => {
    cb(null, 'upload');
  },
  filename: async (req, file, cb) => {
    // Upload de l'image dans le dossier /upload avec son nom original
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50000 * 1000 },
  fileFilter,
}).single('image');

module.exports = upload;
