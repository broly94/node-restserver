const {Router}  = require('express');
const router = Router();

const {verificarToken, verificaAdministrador} = require('../middlewares/autenticacion');

const { getUsuario, getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarioController')

router
  .route('/')
  .get([verificarToken],getUsuarios)
  .post([verificarToken, verificaAdministrador], postUsuario)

router
  .route("/:id")
  .get([verificarToken, verificaAdministrador], getUsuario)
  .put([verificarToken, verificaAdministrador], putUsuario)
  .delete([verificarToken, verificaAdministrador], deleteUsuario);

  module.exports = router;