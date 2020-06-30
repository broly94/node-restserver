const { Router } = require("express");
const router = Router();

const { loginGoogle } = require("../controllers/loginGoogleController");

router
    .route("/")
    .post(loginGoogle);

module.exports = router;
