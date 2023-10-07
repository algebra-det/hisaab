const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send({ message: "Home Admin Route" });
});

module.exports = router;
