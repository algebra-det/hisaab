const transactions = require("../models/Transaction");
const users = require("../models/User");

const getTransactions = async (req, res, next) => {
  // creating one row data in DB beforehand

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
  res.send({ message: "Fetched Successfuly", data });
};
const createTransaction = async (req, res, next) => {
  console.log("req.body: ", req.body);
  try {
    const { productName, sellingPrice, profit } = req.body;
    // creating one row data in DB beforehand

    // const user = await users.create({
    //   firstName: "Akash",
    //   lastName: "Chauhan",
    //   userName: "akash",
    //   email: "akash.th4kur@gmail.com",
    // });
    const data = await transactions.create({
      productName,
      sellingPrice,
      profit,
      createdBy: await users.findOne({ id: 3 }).id,
    });
    res.send({ message: "created Successfuly", data });
  } catch (error) {
    console.log("error occured: ", error);
    res.status(500).send({ message: "Failed", error });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
