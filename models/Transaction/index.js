const { DataTypes } = require("sequelize");
const db = require("../../database");
const createOrUpdateProducts = require("../../database/transactionHooks");

module.exports = db.define(
  "Transaction",
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profit: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          this.getDataValue("sellingPrice") - this.getDataValue("purchasePrice")
        );
      },
      set(value) {
        throw new Error("Do not try to set the `profit` value!");
      },
    },
  },
  {
    hooks: {
      afterSave(transaction) {
        createOrUpdateProducts(transaction);
      },
    },
  }
);
