const router = require("express").Router();

const product_controller = require("../controllers/productController");

router.get("/search", product_controller.getProductBySearch);
router.get("/",product_controller.getAllProduct);
router.get("/:idCategory", product_controller.getbyCategory);
router.get("/:idCategory/:idProduct", product_controller.getbyIdproduct);
module.exports = router;