const Categories = require('../models/Categories');

exports.showCreateGroup = async (req, res) => {
  const categories = await Categories.findAll();
  res.render('create-group', {
    pageName: 'Crear Grupo',
    categories
  });
};