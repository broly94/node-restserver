const { Router } = require('express');
const router = Router();

const { loginDefault } = require('../controllers/loginController');

router
  .route('/')
  .post(loginDefault)

module.exports = router;