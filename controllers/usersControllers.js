const Users = require('../models/Users');

exports.showCreateAccount = (req, res) => {
  res.render('create-account', {
    pageName: 'Crear Cuenta'
  })
};

exports.createAccount = async (req, res) => {
  const user = req.body;

  // Usamos express-validator
  req.checkBody('confirmPass', 'Tienes que confimar la contraseña').notEmpty();
  req.checkBody('confirmPass', 'Las contraseñas no coinciden').equals(req.body.password);
  // Leemos los errores de express
  const expressErrorsList = req.validationErrors();

  try {
    await Users.create(user);

    // Envíamos la confirmación por medio de flash
    req.flash('success', 'Hemos enviado un email para que confirmes tu cuenta');
    res.redirect('/sign-in');
  } catch (error) {
    // Creamos un arreglo de los errores generados por la validación de Sequelize
    // Sequelize los nombra errors y están en error, por eso los extraemos y los listamos
    // en un arreglo
    const sequelizeErrors = error.errors.map(err => err.message);

    // express-validator nombra a los erroes en msg, por lo que debemos extraerlos
    const expressErrors = expressErrorsList.map(err => err.msg);

    // Unimos los errores de sequelize y de express en un mismo arreglo
    const errors = [...sequelizeErrors, ...expressErrors];

    // Llenamos locals.messages en el objeto de flash
    req.flash('errors', errors); // errors es la key y sequelizeErrors el value
    
    // en el objeto de flash
    res.redirect('/');
    console.log(errors);
  }
};

exports.showSignIn = (req, res) => {
  res.render('sign-in', {
    pageName: 'Iniciar Sesión'
  });
};

exports.signIn = (req, res) => {
  res.send('Listo para iniciar sesión :0');
};