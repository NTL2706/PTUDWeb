const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderController");

router.get("/", ordersController.showListOrder);
router.get("/accept-orders/:id", ordersController.acceptOrder);
router.get("/cancel-orders/:id", ordersController.cancelOrder);

module.exports = router;

