const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const nodemailer = require('nodemailer');

const { verificarToken, verificaAdministrador } = require("../middlewares/autenticacion");

app.get("/usuario", verificarToken, (req, res) => {

  let desde = req.query.desde || 0
  desde = Number(desde);

  let limite =req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({ estado: true })
    .skip(desde)
    .limit(limite)
    .exec((err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      //Conteo de todos los registros que devuelve la consulta
      Usuario.countDocuments({ estado: true }, (err, totalRegistros) => {

        res.json({
          ok: true,
          usuarioDB,
          totalRegistros
        });

      })

    });

});

app.post("/usuario", [verificarToken, verificaAdministrador], (req, res) => {
  let { nombre, email, password, role } = req.body;

  let usuario = new Usuario({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
      email
    });
  });
});

app.put("/usuario/:id", [verificarToken, verificaAdministrador], (req, res) => {
  let id = req.params.id;

  const body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

// Deshabilitar usuario

app.delete('/usuario/:id', [verificarToken, verificaAdministrador], (req, res) => {

  const id = req.params.id;

  const cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuario) => {

    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }

    if(usuario.estado == false) {
      res.json({
        ok: true,
        message: 'Usuario Deshabilitado',
        usuario,
      });
    }
  })
})

//Send Email
/*app.post('/send-email', async (req, res) => {

  const {nombre, email, mensaje} = req.body;

  contentHTML = `
    <h1>Informacion del usuario</h1>
     <ul>
      <li>Nombre de usuario: ${nombre}</li>
      <li>Email del usuario: ${email}</li>
     </ul>
     <p>${mensaje}</p>
  `;

  console.log(contentHTML);

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d9d83ba845c054",
      pass: "faa7724cca5814"
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: "'Server Test' <test@test.com>",
    to: "joaquin_leonel_carro@hotmail.com",
    subject: "Formulario de contacto",
    text: "Hello Word",
  });

  console.log("Mensaje enviado", info.messageId);

  console.log("recivido")

})*/

// Elimina usuario 

// app.delete("/usuario/:id", (req, res) => {
     
//   let id = req.params.id;

//   Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//     if(err) {
//       res.status(400).json({
//         ok: false,
//         err
//       })
//     }

//     if(!usuarioBorrado) {
//       res.status(400).json({
//         ok: false,
//         error: {
//           message: 'Usuario no encontrado'
//         }
//       })
//     }

//     res.json({
//       ok: true,
//       usuarioBorrado
//     })

//   })
// });


module.exports =  app;