const transactions = require("../models/Transaction");
const users = require("../models/User");
const profile = require("../models/Profile");

users.hasMany(transactions, {
  foreignKey: "createdBy",
});
transactions.belongsTo(users, {
  foreignKey: "createdBy",
});
users.hasOne(profile);
