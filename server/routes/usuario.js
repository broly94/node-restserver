const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models.js/usuario');

app.get("/usuario", (req, res) => {

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

app.post("/usuario", (req, res) => {

  let { nombre, email, password, role } = req.body;

  let usuario = new Usuario({
      nombre,
      email,
      password: bcrypt.hashSync(password, 10),
      role
  })

  usuario.save( (err, usuarioDB) => {
    
    if(err) {
        return res.status(400).json({
           ok: false,
           err
         });
    }

    res.json({
        ok: true,
        usuario: usuarioDB
    })

  })
});

app.put("/usuario/:id", (req, res) => {

  let id = req.params.id;

  const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })

  })
});

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

// Deshabilitar usuario

app.delete('/usuario/:id', (req, res) => {

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


module.exports =  app;