const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Definicion del schema
const Schema = mongoose.Schema;

//Crear nuevo schema
const categoriaSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, "La categoría es requerida"],
    trim: true,
  },
  estado: {
    type: Boolean,
    default: true
  }
});

//Validación de las propiedades unicas
categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Categorias', categoriaSchema);