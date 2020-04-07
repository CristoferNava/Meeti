const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const usersControllers = require('../controllers/usersControllers')

module.exports = function() {
  router.get('/', homeControllers.home);
  router.get('/create-account', usersControllers.showCreateAccount);


  return router;
};