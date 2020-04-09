const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Para autenticar usuarios mediante la base de datos
const Users = require('../models/Users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  async (email, password, next) => {
    // El código se ejecuta al enviar el formulario de inicio de sesión
    const user = await Users.findOne({where: {email, active: 1}});

    // Revisamos si el usuario existe o no
    if (!user) return next(null, false, {message: 'El usuario no existe'});

    // Revisamos si la contraseña es correcta
    const passValidation = user.validatePassword(password);

    // Si el password no es correcto
    if (!passValidation) return next(null, false, {message: 'Contraseña incorrecta'});

    // Todo cool
    return next(null, user);
  }
));

// Configuración final
passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(user, callback) {
  callback(null, user);
});

module.exports = passport;