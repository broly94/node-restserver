const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    //Si existe un error en el servidor
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //Si el email no existe
    if (!usuarioDB) {
      return res.status(500).json({
        ok: false,
        err: "(Usuario) o contraseña incorrecto",
      });
    }

    // Si la password no es correcta
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(500).json({
        ok: false,
        err: "Usuario o (contraseña) incorrecto",
      });
    }

    //El seed y la fecha de expiracion van en variables de entorno
    let token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

//Configuraciones de google
async function verify(token) {
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
}

app.post("/google", async (req, res) => {
  //Traemos el token de la request que se pasa por ajax en el index
  let token = req.body.idtoken;

  if (!token) {
    return res.status(400).json({
      ok: false,
      error: {
        message: "No se proporcionó en token",
      },
    });
  }

  //Llamamos a la funcion verify para verificar el usuario que se le pasa el token, que se guardará en googleUser si es correcto
  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      ok: false,
      err: e,
    });
  });

  //Buscamos en la db el email que viene desde el sing de google
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    //Si existe un error en el servidor
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    //Si existe el usuario en la db ...
    if(usuarioDB) {
      //Pero si el usuario no esta autenticado con google
      //Significa que el usuario existe pero uso el email de google para autenticarse en nuestra aplicacion
      if(usuarioDB.google === false) {
        return res.status(500).json({
          ok: false,
          err: {
            message: 'Debe autenticarse con su usuario normal'
          }
        });
        //Si no, si el usuario existe pero si se autentico con google, actualizamos el token por la exipración
      } else {
        //Se le crea un token
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        //Enviamos la respuesta con el usuario y el token
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
          leo: true
        })

      }
      //Si el usuario no existe en la db
    } else {

      const { nombre, img, email, google } = googleUser;

      let nuevoUsuario = new Usuario({
        nombre,
        img,
        email,
        google,
        password: ':)'
      });

      nuevoUsuario.save((err, usuarioDB) => {

        if(err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }
      
        //Se le crea un token
        let token = jwt.sign(
          {
            usuario: usuarioDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );


        //Enviamos la respuesta con el usuario y el token
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      })
    }
  });
});

module.exports = app;
