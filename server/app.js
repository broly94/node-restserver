const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");


//Settings
app.set('port', process.env.PORT);
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static( path.resolve(__dirname, 'public')));
app.use(morgan('dev'));

//Configuraciòn global de rutas
app.use('/usuario', require('./routes/usuario'));
app.use("/login", require("./routes/login"));
app.use("/google", require('./routes/loginGoogle'));
app.use('/categoria', require('./routes/categoria'));
app.use("/producto", require("./routes/producto"));

module.exports = app;