const User = require('../models/User');

const initialUser = {
  username: 'firstUser',
  name: 'first user',
  passwordHash: 'hash',
};

const getAllUsersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUser,
  getAllUsersInDb,
};
