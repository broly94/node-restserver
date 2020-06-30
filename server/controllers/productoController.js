const productoCtrl = {};
const Producto = require("../models/productos");
const {
  respuestaError,
  respuestaErrorServer,
} = require("../helpers/respuestas");
const _ = require("underscore");

productoCtrl.getProductos = async (req, res) => {
  try {
    const desde = Number( req.query.desde || 0);
    const limite = Number(req.query.limite || 5); 
    const productos = await Producto.find({ estado: true })
    .skip(desde)
    .limit(limite)
    .populate('categoria');
    const totalProductos = await Producto.countDocuments({ estado: true });

    if (productos.length === 0 || totalProductos === 0) {
      respuestaError(res, 400, "No hay productos");
    }
    return res.json({
      ok: true,
      productos,
      totalProductos,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

productoCtrl.postProducto = async (req, res) => {
  try {
    const usuario = req.usuario._id;
    const { nombre, precioUni, descripcion, estado, categoria } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      precioUni,
      descripcion,
      estado,
      categoria,
      usuario,
    });
    const producto = await nuevoProducto.save();
    if (!producto) {
      respuestaError(res, 400, "Error al crear el producto");
    }
    return res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

productoCtrl.getProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const producto = await Producto.findOne({ _id: id, estado: true });
    if (producto === null) {
      respuestaError(res, 400, "El producto no existe");
    }
    return res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

productoCtrl.putProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const body = _.pick(req.body, [
      "_id",
      "estado",
      "nombre",
      "precioUni",
      "descripcion",
      "categoria",
    ]);
    const producto = await Producto.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!producto) {
      respuestaError(res, 400, "Error al actualizar el producto");
    }
    return res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

productoCtrl.deleteProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const cambiaEstado = {
      estado: false
    };
    const producto = await Producto.findByIdAndUpdate(id, cambiaEstado, {new :true, runValidators: true});
    if (!producto) {
      respuestaError(res, 400, "Error al eliminar el producto");
    }
    return res.json({
      ok: true,
      message: "Producto eliminado",
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

module.exports = productoCtrl;
