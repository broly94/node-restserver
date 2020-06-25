require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT;
const path = require('path');
const morgan = require('morgan');

//Settings
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static( path.resolve(__dirname, 'public')));
app.use(morgan('dev'));

//Configuraciòn global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if(err) throw(err);
      console.log(`DB CONECTADA`);
    });

//mongoose.set('useCreateIndex', true)

app.listen(port, () =>
  console.log(`Server en http://localhost:${port}`)
);
