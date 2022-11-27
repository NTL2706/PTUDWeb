const express = require("express");
const router = express.Router();
const register_controller = require("../controllers/registerController");

router.get("/", register_controller.getRegister);

module.exports = router;