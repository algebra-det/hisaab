const { Sequelize } = require("sequelize");

console.log("DB_URI", process.env.DB_URI);
module.exports = new Sequelize(process.env.DB_URI);
