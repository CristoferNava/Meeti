const Groups = require('../models/Groups');

exports.showNewMeeti = async (req, res) => {
  const groups = await Groups.findAll({where: {UserId: req.user.id}});

  res.render('new-meeti', {
    pageName: 'Crear Nuevo Meeti',
    groups
  });
};