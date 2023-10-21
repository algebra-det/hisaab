const { DataTypes } = require("sequelize");
const db = require("../../database");

module.exports = db.define("Product", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purchasePrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
