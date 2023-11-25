const transactions = require('../models/Transaction')
const products = require('../models/Product')
const users = require('../models/User')
const profile = require('../models/Profile')

users.hasMany(transactions, {
  foreignKey: { name: 'createdBy', allowNull: false },
  onDelete: 'CASCADE'
})
transactions.belongsTo(users, {
  foreignKey: { name: 'createdBy', allowNull: false },
  onDelete: 'CASCADE'
})

users.hasMany(products, {
  foreignKey: { name: 'createdBy', allowNull: false },
  onDelete: 'CASCADE'
})
products.belongsTo(users, {
  foreignKey: { name: 'createdBy', allowNull: false },
  onDelete: 'CASCADE'
})

users.hasOne(profile, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE'
})
profile.belongsTo(users, {
  foreignKey: { name: 'userId', allowNull: false },
  onDelete: 'CASCADE'
})
