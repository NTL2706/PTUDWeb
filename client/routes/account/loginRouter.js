const express = require("express");
const router = express.Router();
const login_controller = require("../../controllers/account/loginController");

router.get("/", login_controller.getLogin);
router.post("/", login_controller.postLogin);


module.exports = router;