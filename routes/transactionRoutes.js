const router = require("express").Router();
const homeController = require("../controller/transactionController");

router.get("/", homeController.getTransactions);
router.post("/", homeController.createTransaction);
router.put("/:id", homeController.updateTransaction);
router.delete("/:id", homeController.deleteTransaction);

module.exports = router;
