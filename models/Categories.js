const Sequelize = require('sequelize');
const db = require('../config/db');

const Categories = db.define('Categories', {
  id: {
    type: Sequelize.INTEGER, 
    primaryKey: true,
    autoIncremente: true
  },
  name: Sequelize.TEXT
});

module.exports = Categories;