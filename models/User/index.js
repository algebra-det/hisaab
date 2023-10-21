const { DataTypes } = require("sequelize");
const db = require("../../database");

module.exports = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // userName: {
  //   type: DataTypes.STRING,
  //   required: [true, "Please Enter username"],
  //   unique: true,
  //   lowercase: true,
  // },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 255],
    },
  },
  role: {
    type: DataTypes.ENUM(["admin", "client"]),
    defaultValue: "client",
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
