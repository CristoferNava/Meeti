const express = require('express');
require('dotenv').config({path: 'variables.env'});

const app = express();

app.use('/', (req, res) => {
  res.send('Listo el servidor');
});

app.listen(process.env.PORT);