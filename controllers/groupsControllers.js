const multer = require('multer');
const multerConfig = require('../config/multer');
const Categories = require('../models/Categories');
const Groups = require('../models/Groups');
const fs = require('fs');

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

exports.showEditGroup = async (req, res) => {
  // Puesto que tenemos consultas independientes no ponemos un await después del otro
  const querys = [];
  querys.push(Groups.findByPk(req.params.groupID));
  querys.push(Categories.findAll());
  // hacemos un await con promise
  const [group, categories] = await Promise.all(querys);

  res.render('edit-group', {
    pageName: 'Editar Grupo',
    group,
    categories
  });
};

exports.editGroup = async (req, res, next) => {
  // Obtenemos el grupo a editar de la base de datos
  const group = await Groups.findOne({where: {id: req.params.groupID, UserId: req.user.id}});

  // Si no existe el grupo o no es el dueño
  if (!group) {
    req.flash('errors', 'Error de operación');
    res.redirect('/administration');
    return next();
  }

  // Todo bien, leemos los valores y actualizamos en la base de datos
  console.log(req.body);
  const {name, description, category, url} = req.body;
  group.name = name;
  group.description = description;
  group.category = category;
  group.url = url;
  await group.save();

  req.flash('success', 'Grupo editado correctamente');
  res.redirect('/administration');
};

exports.showEditImage = async (req, res) => {
  const group = await Groups.findOne({where: {id: req.params.groupID, UserId: req.user.id}});

  res.render('image-group', {
    pageName: 'Cambiar Imagen',
    group
  });
};

exports.editImage = async (req, res, next) => {
  const group = await Groups.findOne({where: {id: req.params.groupID, UserId: req.user.id}});

  if (!group) {
    req.flash(errors, 'Operación no válida');
    res.redirect('/sign-in');
    return next();
  }

  // Si hay una imagen anterior y una nueva tenemos que eliminar la anterior
  if (group.image && req.file) {
    const prevImagePath = `${__dirname}/../public/uploads/groups/${group.image}`;

    // Eliminamos la imagen con filesystem
    fs.unlink(prevImagePath, (err) => {console.log(err);});
  }

  // Si hay una imagen la guardamos
  if (req.file) group.image = req.file.filename;

  await group.save();
  req.flash('success', 'Imagen cambiada correctamente');
  res.redirect('/administration');
};

exports.showRemoveGroup = async (req, res, next) => {
  const group = await Groups.findOne({where: {id: req.params.groupID, UserId: req.user.id}});

  if (!group) {
    req.flash(errors, 'Operación no válida');
    res.redirect('/administration');
    return next();
  }

  // todo coo, ejecutamos la vista
  res.render('remove-group', {
    pageName: 'Eliminar grupo'
  });
};

exports.removeGroup = async (req, res, next) => {
  const group = await Groups.findOne({where: {id: req.params.groupID, UserId: req.user.id}});

  if (!group) {
    req.flash(errors, 'Operación no válida');
    res.redirect('/administration');
    return next();
  }

  // Si el grupo tiene imagen asociada la eliminamos
  if (group.image) {
    const prevImagePath = `${__dirname}/../public/uploads/groups/${group.image}`;

    // Eliminamos la imagen con filesystem
    fs.unlink(prevImagePath, (err) => {console.log(err);});
  }

  // Eliminamos el grupo de la Base Datos
  await Groups.destroy({where: {id: req.params.groupID}});

  req.flash('success', 'Grupo eliminado con éxito');
  res.redirect('/administration');
};