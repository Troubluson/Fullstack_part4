const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({error: 'invalid token'});
  }
  logger.error(error.message);
  next(error);
};

module.exports = {
  errorHandler,
};
