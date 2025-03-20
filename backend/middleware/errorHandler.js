const { formatErrorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Check for syntax errors (like JSON parse errors)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(formatErrorResponse('Invalid JSON in request body', 400));
  }

  // Check for CORS errors
  if (err.name === 'TypeError' && err.message.includes('CORS')) {
    return res.status(500).json(formatErrorResponse('CORS error - origin not allowed', 500));
  }

  // Check for validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(formatErrorResponse(err.message, 400));
  }

  // Check for MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(409).json(formatErrorResponse('Duplicate key error', 409));
    }
    return res.status(500).json(formatErrorResponse('Database error', 500));
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  return res.status(statusCode).json(formatErrorResponse(message, statusCode));
};

module.exports = errorHandler; 