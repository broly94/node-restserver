const jwt = require('jsonwebtoken');

////////////////////////
// VERIFICAR TOKEN
////////////////////////

let verificarToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
         
        if( err ) {
            return res.status(401).json({
                ok: false,
                err,
                error: {
                    message: 'Token no válido'
                }
             })
         }

         req.usuario = decoded.usuario;
         next();
    })
}

////////////////////////////////////
// VERIFICAR ADMINISTRADOR
////////////////////////////////////

let verificaAdministrador = (req, res, next) => {

    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE' ) {
 
        next();

    } else {
 
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos para esta acción'
            }
        })
    }
}

//////////////////////////////////////////
// VERIFICAR TOKEN IMAGEN
//////////////////////////////////////////

const verificaImagenToken = (req, res, next) => {

    const token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          err,
          error: {
            message: "Token no válido",
          },
        });
      }

      req.usuario = decoded.usuario;
      next();

    });
}

module.exports = {
    verificarToken,
    verificaAdministrador,
    verificaImagenToken
}