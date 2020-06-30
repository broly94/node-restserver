const usuarioCtrl = {};
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const {
  respuestaErrorServer,
  respuestaError,
} = require("../helpers/respuestas");

//OBTIENE TODOS LOS USUARIOS
usuarioCtrl.getUsuarios = async (req, res) => {
  try {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    const usuarios = await Usuario.find({ estado: true })
      .skip(desde)
      .limit(limite);
    const totalRegistros = await Usuario.countDocuments({ estado: true });

    if (totalRegistros === 0) {
      respuestaError(res, 400, "No hay registros");
    }

    if (usuarios.length > 0 && totalRegistros > 0) {
      return res.json({
        ok: true,
        usuarios,
        totalRegistros,
      });
    }
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

// OBTIENE UN USUARIO POR ID
usuarioCtrl.getUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    const usuario = await Usuario.findById(id);

    if (usuario === null) {
      respuestaError(res, 400, "El usuario no existe");
    }

    return res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

// INSERTA UN USUARIO
usuarioCtrl.postUsuario = async (req, res) => {
  try {
    let { nombre, email, password, role } = req.body;

    let usuarioNuevo = new Usuario({
      nombre,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
    });

    const usuario = await usuarioNuevo.save();

    if (!usuario) {
      respuestaErrorServer(res, "Error", 400, "Error al insertar el usuario");
    }

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    respuestaErrorServer(resp, error, 400, "Error en el servidor");
  }
};

// ACTUALIZA USUARIO
usuarioCtrl.putUsuario = async (req, res) => {
  try {
    let id = req.params.id;

    const body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    const usuario = await Usuario.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!usuario) {
      respuestaErrorServer(res, "Error", 400, "Error al actualizar el usuario");
    }

    return res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

// ELIMINA USUARIO
usuarioCtrl.deleteUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const cambiaEstado = {
      estado: false,
    };

    const usuario = await Usuario.findByIdAndUpdate(id, cambiaEstado, {
      new: true,
    });

    if (!usuario) {
      respuestaErrorServer(res, "Error", 400, "Error en el servidor");
    }

    if (usuario.estado == false) {
      res.json({
        ok: true,
        message: "Usuario Deshabilitado",
        usuario,
      });
    }
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};

module.exports = usuarioCtrl;
