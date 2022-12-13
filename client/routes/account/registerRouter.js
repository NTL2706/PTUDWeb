const express = require("express");
const router = express.Router();
const register_controller = require("../../controllers/account/registerController");

router.get("/", register_controller.getRegister);
router.post("/", register_controller.postRegister);

module.exports = router;