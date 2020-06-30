const { Router } = require('express');
const router = Router();
const { getProductos, getProducto, postProducto, putProducto, deleteProducto } = require('../controllers/productoController');
const { verificaAdministrador, verificarToken } = require('../middlewares/autenticacion');

router
    .route('/')
    .get(getProductos)
    .post([verificarToken, verificaAdministrador],postProducto)

router
    .route('/:id')
    .get(getProducto)
    .put([verificarToken, verificaAdministrador],putProducto)
    .delete([verificarToken, verificaAdministrador],deleteProducto)

module.exports = router;