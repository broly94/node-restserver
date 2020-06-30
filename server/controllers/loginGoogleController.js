const loginGoogleCtrl = {};
const { respuestaErrorServer,respuestaError } = require("../helpers/respuestas");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

//Configuraciones de google
const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  const { name, picture, email } = payload;

  return {
    nombre: name,
    img: picture,
    email,
    google: true,
  };
};

loginGoogleCtrl.loginGoogle = async (req, res) => {
    try {
          //Traemos el token de la request que se pasa por ajax en el index

          let token = req.body.idtoken;

          if (!token) {
            respuestaError(res, 400, "No se proporciono el token");
          }

          //Llamamos a la funcion verify para verificar el usuario que se le pasa el token, que se guardará en googleUser si es correcto
          let googleUser = await verify(token).catch((e) => {
            respuestaError(res, 400, e);
          });

          //Buscamos en la db el email que viene desde el sing de google
          const usuario = await Usuario.findOne({ email: googleUser.email });
          //Si existe el usuario en la db ...
          if (usuario) {
            //Pero si el usuario no esta autenticado con google
            //Significa que el usuario existe pero uso el email de google para autenticarse en nuestra aplicacion
            if (usuario.google === false) {
              respuestaError( res,500,"Debe autenticarse con su usuario normal");
              //Si no, si el usuario existe pero si se autentico con google, actualizamos el token por la exipración
            } else {
              //Se le crea un token
              let token = jwt.sign({ usuario }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN,
              });
              //Enviamos la respuesta con el usuario y el token
              return res.json({
                ok: true,
                usuario,
                token,
              });
            }
            //Si el usuario no existe en la db
          } else {
            const { nombre, img, email, google } = googleUser;

            let nuevoUsuario = new Usuario({
              nombre,
              img,
              email,
              google,
              password: ":)",
            });

            const usuario = await nuevoUsuario.save();

            //Se le crea un token
            let token = jwt.sign({ usuario }, process.env.SEED, {
              expiresIn: process.env.CADUCIDAD_TOKEN,
            });
            //Enviamos la respuesta con el usuario y el token
            return res.json({
              ok: true,
              usuario,
              token,
            });
          }
        } catch (error) {
        respuestaErrorServer(res, error, 400, "Error en el servidor");
    }
};

module.exports = loginGoogleCtrl;

