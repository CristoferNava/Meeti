const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config({path: 'variables.env'});
const path = require('path');
const routes = require('./routes/routes');

// Configuración de la base de datos
const db = require('./config/db');
require('./models/Users');
db.sync()
  .then(() => {console.log('Conexión a la base de datos establecida');})
  .catch((err) => {console.log(err);});

// Creamos la aplicación
const app = express();

// Habilitamos EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // Establecemos la ubicación de las vistas

// Archivos estáticos
app.use(express.static('public'));

// Middlewares propios
app.use((req, res, next) => {
  const date = new Date();
  res.locals.year = date.getFullYear();
  next();
});

// Habilitamos las rutas
app.use('/', routes());

app.listen(process.env.PORT);