const Profile = require("../../models/Profile");

const createProfile = async (user) => {
  await Profile.create({
    userId: user.id,
  });
};

module.exports = createProfile;
