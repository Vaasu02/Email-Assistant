const Joi = require('joi');
const { formatErrorResponse } = require('../utils/responseFormatter');

const validateRequest = (schema) => {
  return (req, res, next) => {
    // Input validation
    try {
      // Check if req.body exists and is not null/undefined
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json(formatErrorResponse('Request body is missing or invalid', 400));
      }
      
      const { error } = schema.validate(req.body, { 
        abortEarly: false,  // Return all errors, not just the first one
        stripUnknown: true  // Remove unknown fields
      });
      
      if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(formatErrorResponse(errorMessage, 400));
      }
      
      next();
    } catch (err) {
      return res.status(500).json(formatErrorResponse('Validation error: ' + err.message, 500));
    }
  };
};

module.exports = validateRequest; 