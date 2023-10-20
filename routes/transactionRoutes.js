const router = require("express").Router();
const homeController = require("../controller/transactionController");

router.get("/", homeController.getTransactions);
router.post("/", homeController.createTransaction);

module.exports = router;
