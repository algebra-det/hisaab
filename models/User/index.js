const { DataTypes } = require("sequelize");
const db = require("../../database");
const createProfileHook = require("../../database/userHooks");

module.exports = db.define(
  "User",
  {
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
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    hooks: {
      afterCreate(user) {
        createProfileHook(user);
      },
    },
  }
);
