const router = require("express").Router();
const my_account_controller = require("../controllers/myAccountController");

router.get("/", my_account_controller.getMyAccount);

router.get("/edit", my_account_controller.getEditMyAccount);

router.get("/change-password", my_account_controller.getChangePassWordMyAccount);


module.exports = router;