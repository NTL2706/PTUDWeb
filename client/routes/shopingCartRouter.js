const express = require("express");
const router = express.Router();
const shoping_cart_controller = require("../controllers/shopingCartController");

router.get("/", shoping_cart_controller.getShopingCart);

module.exports = router;