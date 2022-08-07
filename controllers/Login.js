// eslint-disable-next-line new-cap
const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

loginRouter.post('/', async (request, response) => {
  const {username, password} = request.body;

  const user = await User.findOne({username});
  const passwordCorrect =
    user !== null ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
      .status(200)
      .send({token, username: user.username, name: user.name});
});

module.exports = loginRouter;
