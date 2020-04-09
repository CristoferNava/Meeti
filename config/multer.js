const multer = require('multer');
const shortid = require('shortid');

module.exports = {
  limits: {fileSize: 1000000}, // Máximo imágenes de un megabyte
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, `${__dirname}/../public/uploads/groups`);
    },
    filename: (req, file, next) => {
      // obtenemos la extensión: tenemos name/pdf por ejemplo
      const extension = file.mimetype.split('/')[1];
      next(null, `${shortid.generate()}.${extension}`);
    }
  }),
  fileFilter(req, file, next) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      // El formato es válido
      next(null, true); // true porque aceptamos el archivo
    } else {
      // El formato no es válido
      next(new Error('Formato no válido'), false); // false porque rechazamos el archivo
      // Podemos generar erroes y accedemos mediantes error.message
    }
  }
};