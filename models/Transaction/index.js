const { DataTypes } = require('sequelize')
const db = require('../../database')
const createOrUpdateProducts = require('../../database/transactionHooks')

module.exports = db.define(
  'Transaction',
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    purchasePrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sellingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    profit: {
      type: DataTypes.INTEGER
    }
  },
  {
    hooks: {
      afterValidate: transaction => {
        transaction.profit =
          transaction.sellingPrice - transaction.purchasePrice
      },
      afterSave(transaction) {
        createOrUpdateProducts(transaction)
      }
    }
  }
)
