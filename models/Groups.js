const {v4: uuid} = require('uuid');
const Sequelize = require('sequelize');
const db = require('../config/db');
const Users = require('./Users');
const Categories = require('./Categories');

const Groups = db.define('Groups', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuid()
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Debes agregar un nombre'}
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { 
      notEmpty: {msg: 'Debes agregar una descripción'}
    }
  },
  url: Sequelize.TEXT,
  image: Sequelize.TEXT
});

Groups.belongsTo(Users);
Groups.belongsTo(Categories);

module.exports = Groups;