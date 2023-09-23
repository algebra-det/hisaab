const { DataTypes } = require("sequelize");
const db = require("../../database");

module.exports = db.define("Transaction", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  profit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
