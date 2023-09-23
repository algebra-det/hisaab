const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send({ message: "baseRoute" });
});

module.exports = router;
