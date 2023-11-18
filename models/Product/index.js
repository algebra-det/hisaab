const { DataTypes } = require('sequelize')
const db = require('../../database')

module.exports = db.define(
  'Product',
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastSellingPrice: {
      type: DataTypes.INTEGER,
    },
    totalSale: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'createdBy'] },
    },
  }
)
