const passport = require('passport');

exports.authUser = passport.authenticate('local', {
  successRedirect: '/administration', 
  failureRedirect: '/sign-in',
  failureFlash: true, // Mensajes configurados previamente en passport.js
  // los mensajes se envian al frotend por medio de flash
  badRequestMessage: 'Ambos campos son obligatorios'
});

exports.isAuthenticated = (req, res, next) => {
  // Si el usuario está autenticado le dejamos pasar
  if (req.isAuthenticated()) {
    return next(); // Lo enviamos al siguiente middleware
  }

  // si no está autenticado
  res.redirect('/sign-in');
};