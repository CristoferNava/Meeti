const multer = require('multer');
const multerConfig = require('../config/multer');
const Categories = require('../models/Categories');
const Groups = require('../models/Groups');

const upload = multer(multerConfig).single('image'); // name del form
exports.uploadImage = (req, res, next) => {
  upload(req, res, function(error) {
    if (error) {
      if (error instanceof multer.MulterError) { // errores de MulterError
        if (error.code === 'LIMIT_FILE_SIZE') {
          req.flash('errors', 'El archivo debe tener un tamaño menor un megabyte');
          res.redirect
        } else {
          req.flash('errors', error.message);
        }
      } else if (error.hasOwnProperty('message')) { // Erromes mandados por medio de config/multer.js
        req.flash('errors', error.message);
      }
      res.redirect('back');
    } else {
      next(); // Pasamos al siguiente middleware (guardar información en la DB)
    }
  });
};

exports.showCreateGroup = async (req, res) => {
  const categories = await Categories.findAll();
  res.render('create-group', {
    pageName: 'Crear Grupo',
    categories
  });
};

exports.createGroup = async (req, res) => {
  // sanitizamos los campos
  req.sanitizeBody('name');
  req.sanitizeBody('url');
  
  const group = req.body;


  // Almacenamos el usuario autenticado como el creador del grupo
  group.UserId = req.user.id;
  group.CategoryId = req.body.category;

  // Leemos la imagen que se ha subido por medio de Multer (primero se ejecuta ese middleware)
  if (req.file) {
    group.image = req.file.filename;
  }
  
  try {
    await Groups.create(group);
    req.flash('success', 'Grupo creado correctamente');
    res.redirect('/administration');
  } catch (error) {
    // Extraemos los errores de Sequelize
    const errors = error.errors.map(err => err.message);
    req.flash('errors', errors);
    res.redirect('/create-group');
  }
};