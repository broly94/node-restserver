const { Router } = require('express');
const router = Router();
const { getProductos, getProducto, postProducto, putProducto, deleteProducto, getProducto_query } = require('../controllers/productoController');
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

router
    .route('/buscar/:query')
    .get(getProducto_query)

module.exports = router;