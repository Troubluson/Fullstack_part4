// eslint-disable-next-line new-cap
const userRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

userRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  const {username, name, password} = request.body;
  if (password.length < 3) {
    return response
        .status(400)
        .json({error: 'Password must be at least 3 characters long'});
  }
  const existingUser = await User.findOne({username});
  if (existingUser) {
    return response.status(400).json({error: 'Username must be unique'});
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({username, name, passwordHash});

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = userRouter;
