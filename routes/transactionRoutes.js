const router = require("express").Router();
const homeController = require("../controller/transactionController");

router.get("/", homeController.getTransactions);
router.get("/stats", homeController.transactionStats);
router.post("/", homeController.createTransaction);
router.put("/:id", homeController.updateTransaction);
router.delete("/:id", homeController.deleteTransaction);

module.exports = router;
