// ============================
//  PUERTO
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  ENTORNO
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  BASE DE DATOS
// ============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Variable de entorno de heroku para la conexion a mongodb
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


