const router = require("express").Router();
const user_controller = require("../controllers/userController");

router.get("/all-user", user_controller.getAllUser);

router.get("/edit-user/:id", user_controller.getEditAccountUser);

router.post("/edit-user/:id", user_controller.postEditAccountUser);

router.get("/delete-user/:id", user_controller.getDeleteAccountUser);

router.get("/block-user/:id", user_controller.getBlockAccountUser);

router.get("/unblock-user/:id",user_controller.getUnBlockAccountUser);

module.exports = router;