const { Sequelize } = require("sequelize");

module.exports = new Sequelize("hisaab", "akash", "hisaab1234", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});
