const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const db = require('../config/db');

const Users = db.define('Users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING(60),
  image: Sequelize.STRING(60),
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    validate: {
      isEmail: {msg: 'Agrega un correo válido'}
    },
    unique: {
      args: true,
      msg: 'El correo ya está registrado'
    },
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña no puede estar vacía'
      }
    }
  },
  active: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  tokenPass: Sequelize.STRING,
  tokenDate: Sequelize.DATE
}, {
  hooks: {
    beforeCreate(user) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10, null));
    }
  }
});

// Comparamos el password ingresado con el de la base de datos
Users.prototype.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Users;