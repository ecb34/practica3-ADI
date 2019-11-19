//Cargamos el módulo express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors');
//load env
dotenv.config({
    path: './config.env'
});
//En este caso hemos vinculado el middleware con la aplicación global
//También lo podríamos vincular a un router o a una URL
app.use(bodyParser.json());
app.use(cors());

require('./db/database');

app.use('/api', require('./routes/routes'));


//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
});