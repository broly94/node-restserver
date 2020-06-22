const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models.js/usuario");

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        
        //Si existe un error en el servidor
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        //Si el email no existe
        if(!usuarioDB) {
            return res.status(500).json({
              ok: false,
              err: '(Usuario) o contraseña incorrecto'
            });
        }

        // Si la password no contraseña
        if( !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
              ok: false,
              err: "Usuario o (contraseña) incorrecto",
            });
        }

        //El seed y la fecha de expiracion van en variables de entorno
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })

})


module.exports = app;
