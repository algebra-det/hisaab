const router = require("express").Router();
const transactions = require("../models/Transaction");

router.get("/", async (req, res, next) => {
  // await transactions.create({
  //   productName: "Pen",
  //   sellingPrice: 12,
  //   profit: 2,
  // });
  const data = await transactions.findAll();
  console.log(data);
  res.send({ message: "Fetched Successfuly", data });
});

module.exports = router;
