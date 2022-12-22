const router = require("express").Router();
const product_controller = require("../controllers/productController");
router.get("/add-category", product_controller.getAddCategory);
router.post("/add-category", product_controller.postAddCategory);
router.get("/show-category", product_controller.getCategoryView);
module.exports = router;