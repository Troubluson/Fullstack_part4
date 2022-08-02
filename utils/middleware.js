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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
