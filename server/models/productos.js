var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

var productoSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  precioUni: {
    type: Number,
    required: [true, "El precio únitario es necesario"],
  },
  descripcion: { type: String, required: false },
  estado: { type: Boolean, required: true, default: true },
  categoria: { type: Schema.Types.ObjectId, ref: "Categorias", required: true }
});

productoSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})

module.exports = mongoose.model("Productos", productoSchema);
