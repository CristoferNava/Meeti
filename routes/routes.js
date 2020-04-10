const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');
const usersControllers = require('../controllers/usersControllers')
const authControllers = require('../controllers/authControllers');
const adminControllers = require('../controllers/adminControllers');
const groupControllers = require('../controllers/groupsControllers');

module.exports = function() {
  router.get('/', homeControllers.home);
  router.get('/create-account', usersControllers.showCreateAccount);
  router.post('/create-account', usersControllers.createAccount);
  router.get('/sign-in', usersControllers.showSignIn);
  router.post('/sign-in', authControllers.authUser);
  router.get('/confirm-account/:email', usersControllers.confirmAccount);

  // Administration
  router.get('/administration', 
    authControllers.isAuthenticated,
    adminControllers.panelAdmin
  );

  // Groups
  router.get('/create-group',
    authControllers.isAuthenticated, // guardamos la referencia del usuario que creó el grupo
    groupControllers.showCreateGroup,
  );
  router.post('/create-group',
    authControllers.isAuthenticated,
    groupControllers.uploadImage,
    groupControllers.createGroup
  );  
  router.get('/edit-group/:groupID',
    authControllers.isAuthenticated,
    groupControllers.showEditGroup,
  );
  router.post('/edit-group/:groupID',
    authControllers.isAuthenticated,
    groupControllers.editGroup
  );

  // Edit image group
  router.get('/group-image/:groupID', 
    authControllers.isAuthenticated,
    groupControllers.showEditImage
  );

  router.post('/group-image/:groupID', 
    authControllers.isAuthenticated,
    groupControllers.uploadImage,
    groupControllers.editImage
  );

  return router;
};