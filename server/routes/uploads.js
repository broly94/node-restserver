const { Router } = require('express');
const router = Router();

const { putUpload } = require('../controllers/uploadController');

router
    .route('/:tipo/:id')
    .put(putUpload)

module.exports = router