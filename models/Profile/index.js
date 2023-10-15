const { DataTypes } = require("sequelize");
const db = require("../../database");

module.exports = db.define("Profile", {
  ProfilePic: {
    type: DataTypes.STRING,
  },
});
