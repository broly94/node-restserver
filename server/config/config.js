// ============================
//  PUERTO
// ============================
process.env.PORT = process.env.PORT || 4000;

// ============================
//  ENTORNO
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  BASE DE DATOS
// ============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/app-ventas';
} else {
    //Variable de entorno de heroku para la conexion a mongodb
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ============================
//  VENCIMIENTO DEL TOKEN
// ============================

process.env.CADUCIDAD_TOKEN = '24h';

// ============================
//  SEED
// ============================

process.env.SEED = process.env.SEED || "secret-tok_desarrollo";


// ============================
//  GOOGLE CLIENT ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '111739662016-9plkfg1kok4f46lni9gde3ne9t5jsnn7.apps.googleusercontent.com';