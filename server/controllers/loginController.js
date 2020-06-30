const loginCtrl = {};
const { respuestaErrorServer, respuestaError } = require("../helpers/respuestas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");


loginCtrl.loginDefault = async (req, res) => {

  try {
    let {email, password} = req.body;

    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      respuestaError(res, 400, "El usuario no existe");
    }

    //Si el email no existe
    if (!usuario.email) {
      respuestaError(res, 400, "El email no es correcto");
    }

    // Si la password no es correcta
    if (!bcrypt.compareSync(password, usuario.password)) {
      respuestaError(res, 400, "La contraseña no es correcta");
    }

    //El seed y la fecha de expiracion van en variables de entorno
    let token = jwt.sign({ usuario }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    respuestaErrorServer(res, error, 400, "Error en el servidor");
  }
};


module.exports = loginCtrl;
