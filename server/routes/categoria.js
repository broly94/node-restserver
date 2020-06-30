const { Router } = require('express');
const router = Router();
const { getCategoria, getCategorias, postCategoria, deleteCategoria, putCategoria } = require('../controllers/categoriaController');

router
    .route('/')
    .get(getCategorias)
    .post(postCategoria)

router
    .route('/:id')
    .get(getCategoria)
    .delete(deleteCategoria)
    .put(putCategoria)

module.exports = router;