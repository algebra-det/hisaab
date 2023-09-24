const router = require("express").Router();
const transactions = require("../models/Transaction");
const users = require("../models/User");

router.get("/", async (req, res, next) => {
  // const user = await users.create({
  //   firstName: "Akash",
  //   lastName: "Chauhan",
  //   userName: "akash",
  //   email: "akash.th4kur@gmail.com",
  // });
  // await transactions.create({
  //   productName: "Pen",
  //   sellingPrice: 12,
  //   profit: 2,
  //   createdBy: user.id,
  // });
  const data = await transactions.findAll({
    include: [
      {
        model: users,
      },
    ],
  });
  console.log(data);
  res.send({ message: "Fetched Successfuly", data });
});

module.exports = router;
