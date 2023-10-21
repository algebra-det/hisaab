const { DataTypes } = require("sequelize");
const db = require("../../database");

module.exports = db.define("Profile", {
  name: {
    type: DataTypes.STRING,
  },
  ProfilePic: {
    type: DataTypes.STRING,
  },
});
