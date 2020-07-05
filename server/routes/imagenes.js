const { Router } = require('express');
const router = Router();

const { getImagenes } = require('../controllers/imagenesControler');
const { verificaImagenToken } = require('../middlewares/autenticacion');

router
    .route('/:tipo/:img')
    .get([verificaImagenToken], getImagenes)

module.exports = router;