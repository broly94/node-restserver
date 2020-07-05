const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const fileUpload = require('express-fileupload');


//Settings
app.set('port', process.env.PORT);
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static( path.resolve(__dirname, '../public')));
app.use(morgan('dev'));
app.use(fileUpload({useTempFiles: true}))

//Configuraciòn global de rutas
app.use('/usuario', require('./routes/usuario'));
app.use("/login", require("./routes/login"));
app.use("/google", require('./routes/loginGoogle'));
app.use('/categoria', require('./routes/categoria'));
app.use("/producto", require("./routes/producto"));
app.use('/upload', require('./routes/uploads'));
app.use('/imagen', require('./routes/imagenes'));

module.exports = app;