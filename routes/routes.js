const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const usersControllers = require('../controllers/usersControllers')

module.exports = function() {
  router.get('/', homeControllers.home);
  router.get('/create-account', usersControllers.showCreateAccount);
  router.post('/create-account', usersControllers.createAccount);
  router.get('/sign-in', usersControllers.showSignIn);
  router.post('/sign-in', usersControllers.signIn);
  
  return router;
};