﻿const router = require("express").Router();
const home_controller = require("../controllers/homeController");
router.get("/", home_controller.index);

module.exports = router;