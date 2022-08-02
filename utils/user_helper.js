const User = require('../models/User');

const getAllUsersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  getAllUsersInDb,
};
