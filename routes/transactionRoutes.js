const router = require("express").Router();
const homeController = require("../controller/transactionController");

router.get("/", homeController.getTransactions);
router.post("/create", homeController.createTransaction);

module.exports = router;
