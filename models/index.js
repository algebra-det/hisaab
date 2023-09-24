const transactions = require("../models/Transaction");
const users = require("../models/User");

users.hasMany(transactions, {
  foreignKey: "createdBy",
});

transactions.belongsTo(users, {
  foreignKey: "createdBy",
});
