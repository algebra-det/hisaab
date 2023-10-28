const router = require("express").Router();
const authController = require("../controller/authController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/verify", authController.verify);

module.exports = router;
