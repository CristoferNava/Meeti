const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const expressValidator = require('express-validator'); // Para validar repeatPassword
require('dotenv').config({path: 'variables.env'});
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
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

// Habilitamos bodyParser para poder leer de los formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Habilitamos el uso las validaciones de Express
app.use(expressValidator());

// Habilitamos EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // Establecemos la ubicación de las vistas

// Archivos estáticos
app.use(express.static('public'));

// Habilitamos cookie parser, las sesiones crean cookies
app.use(cookieParser());

// Creamos las sesiones con sus firmas
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));

// Habilitamos flash
app.use(flash());

// Middlewares propios
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  const date = new Date();
  res.locals.year = date.getFullYear();
  next();
});

// Habilitamos las rutas
app.use('/', routes());

app.listen(process.env.PORT);