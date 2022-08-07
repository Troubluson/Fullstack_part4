const User = require('../models/User');
const logger = require('./logger');
const jwt = require('jsonwebtoken');

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({error: 'invalid token'});
  }
  logger.error(error.message);
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decryptedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decryptedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'});
  }
  const user = await User.findById(decryptedToken.id);
  if (!user) {
    return res
        .status(404)
        .json({error: 'User corresponding to token not found'});
  }
  req.user = user;

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
