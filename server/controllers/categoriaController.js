const categoriasCtrl = {};
const Categorias = require("../models/categorias");
const {
  verificarToken,
  verificaAdministrador,
} = require("../middlewares/autenticacion");
const {
  respuestaError,
  respuestaErrorServer,
} = require("../helpers/respuestas");

categoriasCtrl.getCategorias = async (req, res) => {
  try {
    const categorias = await Categorias.find({estado: true});
    const totalCategorias = await Categorias.countDocuments({estado: true})
    if (totalCategorias.length === 0) {
      respuestaError(res, 400, "No hay categorias registradas");
    }
    return res.json({
      ok: true,
      categorias,
      totalCategorias
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

categoriasCtrl.postCategoria = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const nuevaCategoria = new Categorias({ nombre, estado });
    const categoria = await nuevaCategoria.save();
    if (!categoria) {
      respuestaError(res, 400, "Error al ingresar la categoria");
    }
    return res.json({
      ok: true,
      categoria,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

categoriasCtrl.putCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, estado } = req.body;
    const categoria = await Categorias.findByIdAndUpdate(
      id,
      { nombre, estado },
      { new: true }
    );
    if (!categoria) {
      respuestaError(res, 400, "Error al actualizar categoria");
    }
    return res.json({
      ok: true,
      categoria,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

categoriasCtrl.deleteCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await Categorias.findByIdAndDelete(id);
    if (!categoria) {
      respuestaError(res, 400, "No se pudo eliminar la categoria");
    }
    return res.json({
      ok: true,
      message: "Categoria eliminada",
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

categoriasCtrl.getCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await Categorias.findOne({_id: id, estado: true});
    if (categoria === null) {
      respuestaError(res, 400, "La categoria no existe");
    }
    return res.json({
      ok: false,
      categoria,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");

  }
};

module.exports = categoriasCtrl;
