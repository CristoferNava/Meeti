const Groups = require('../models/Groups');

exports.panelAdmin = async (req, res) => {
  const groups = await Groups.findAll({where: {UserId: req.user.id}});
  res.render('panelAdmin', {
    pageName: 'Panel de Administración',
    groups
  });
};