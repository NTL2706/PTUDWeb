const router = require("express").Router();
const my_account_controller = require("../../controllers/account/myAccountController");

router.get("/", my_account_controller.getMyAccount);

router.get("/logout", my_account_controller.getLogout);

router.get("/edit", my_account_controller.getEditMyAccount);

router.get("/change-password", my_account_controller.getChangePassWordMyAccount);

router.post("/edit", my_account_controller.postEditMyAccount);


module.exports = router;