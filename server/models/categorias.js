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
    required: [true, "El estado es requerido"],
    default: true,
  },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" }
});

categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Categorias', categoriaSchema);