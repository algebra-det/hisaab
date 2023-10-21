const users = require("../models/User");
const { Op } = require("sequelize");
const { hashString } = require("../helpers/bcryptHelper");

const allUsers = async (req, res, next) => {
  const data = await users.findAll({
    where: {
      [Op.not]: [{ id: req.user.id }, { role: "admin" }],
    },
  });
  res.status(400).json({
    message: "Fetched Successfully",
    data,
  });
};

const activateUser = async (req, res) => {
  const { active } = req.body;
  const { userId } = req.params;
  console.log("Active is: ", active, typeof active);
  if (!userId || typeof active !== "boolean")
    return res.status(400).json({
      message: "Please enter correct values",
    });

  const requiredUser = await users.findByPk(userId);
  if (!requiredUser)
    return res.status(400).json({
      message: `No User found with ID ${userId}`,
    });

  await requiredUser.update({ active });
  return res.json({
    message: "User Status updated successfully",
    data: requiredUser,
  });
};

const updateUser = async (req, res) => {
  const userBody = req.body;
  const { userId } = req.params;
  delete userBody["id"];
  if (!userId)
    return res.status(400).json({
      message: "user id is required",
    });
  if (userBody.password)
    userBody.password = await hashString(userBody.password);

  const requiredUser = await users.findByPk(userId);
  if (!requiredUser)
    return res.status(400).json({
      message: `No User found with ID ${userId}`,
    });

  if (requiredUser.role === "admin" || requiredUser.id === req.user.id)
    return res.status(400).json({
      message: `Not Authorized to delete such/this user(s)`,
    });

  await requiredUser.update({ ...userBody });
  delete requiredUser["password"];
  return res.json({
    message: "User Status updated successfully",
    data: requiredUser,
  });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return res.status(400).json({
      message: "UserId is required",
    });

  const requiredUser = await users.findByPk(userId);
  if (!requiredUser)
    return res.status(400).json({
      message: `No User found with ID ${userId}`,
    });
  if (requiredUser.role === "admin" || requiredUser.id === req.user.id)
    return res.status(400).json({
      message: `Not Authorized to delete such/this user(s)`,
    });

  await requiredUser.destroy();
  return res.json({
    message: "User Deleted Successfully",
    data: requiredUser,
  });
};
module.exports = {
  allUsers,
  activateUser,
  deleteUser,
  updateUser,
};
