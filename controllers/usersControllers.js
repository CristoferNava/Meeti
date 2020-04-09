const Users = require('../models/Users');
const {sendEmail} = require('../handlers/emails');

exports.showCreateAccount = (req, res) => {
  res.render('create-account', {
    pageName: 'Crear Cuenta'
  })
};

exports.createAccount = async (req, res, next) => {
  const user = req.body;

  // Usamos express-validator
  req.checkBody('confirmPass', 'Tienes que confimar la contraseña').notEmpty();
  req.checkBody('confirmPass', 'Las contraseñas no coinciden').equals(req.body.password);
  
  // const myValidation = [];
  // if (user.password !== user.confirmPass) {
  //   myValidation.push('Contreseñas diferentes');
  // }
  // console.log(user.confirmPass);
  // if (!user.confirmPass) {
  //   myValidation.push('No puede ir vacío');
  // }

  // if (myValidation) {
  //   req.flash('errors', myValidation); // errors es la key y sequelizeErrors el value
    
  //   // en el objeto de flash
  //   res.redirect('/');
  //   console.log(myValidation);
  //   next();
  // }

  // Leemos los errores de express
  // Cuidado con el bug, si hay errores devuelve un arreglo con objetos dentro,
  // sino devuelve false
  // const expressErrorsList = req.validationErrors();
  // console.log(expressErrorsList);

  try {
    await Users.create(user);

    // Generamos la URL de confirmación de cuenta
    const url = `http://${req.headers.host}/confirm-account/${user.email}`;

    // Enviamos el email de confirmación al usuario
    await sendEmail({
      user,
      url,
      subject: 'Confirma tu cuenta en Meeti',
      file: 'confirm-account'
    });

    // Envíamos la confirmación por medio de flash
    req.flash('success', 'Hemos enviado un email para que confirmes tu cuenta');
    res.redirect('/sign-in');
  } catch (error) {
    console.log(error);
    // Creamos un arreglo de los errores generados por la validación de Sequelize
    // Sequelize los nombra errors y están en error, por eso los extraemos y los listamos
    // en un arreglo
    const sequelizeErrors = error.errors.map(err => err.message);

    // express-validator nombra a los erroes en msg, por lo que debemos extraerlos
    // revisamos si hay errores
    // let expressErrors = [];
    // // if (expressErrorsList) {
    //   expressErrors = expressErrorsList.map(err => err.msg);
    // // }

    // Unimos los errores de sequelize y de express en un mismo arreglo
    const errors = [...sequelizeErrors];

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