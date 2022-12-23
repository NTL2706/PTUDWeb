const router = require("express").Router();
const product_controller = require("../controllers/productController");
router.get("/add-category", product_controller.getAddCategory);
router.post("/add-category", product_controller.postAddCategory);
router.get("/show-category", product_controller.getCategoryView);
router.get("/show-producer", product_controller.getShowProducer);
router.get("/add-producer", product_controller.getAddProducer);
router.get("/add-producer", product_controller.postAddProducer);


module.exports = router;