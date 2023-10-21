const router = require("express").Router();
const adminController = require("../controller/adminController");

router.get("/users", adminController.allUsers);
router.put("/users/:userId", adminController.updateUser);
router.patch("/users/:userId", adminController.activateUser);
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;
