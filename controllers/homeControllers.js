exports.home = (req, res) => {
  res.render('create-account', {
    pageName: 'Inicio'
  });

  // console.log(res.locals.messages);
};