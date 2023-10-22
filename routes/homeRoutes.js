const router = require("express").Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({ message: "List Your Transactions." });
});

module.exports = router;
