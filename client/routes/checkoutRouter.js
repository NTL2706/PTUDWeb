const router = require("express").Router();
const checkOutController = require("../controllers/checkoutController");

router.get("/", checkOutController.getCheckOut);
router.post("/", checkOutController.postCheckOut);

module.exports = router;