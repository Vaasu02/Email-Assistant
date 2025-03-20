const express = require('express');
const { generateEmail } = require('../controllers/geminiController');
const validateRequest = require('../middleware/validator');
const Joi = require('joi');

const router = express.Router();

// Validation schema for generating email
const generateEmailSchema = Joi.object({
  prompt: Joi.string().required(),
  recipientName: Joi.string().allow(''),
  additionalContext: Joi.string().allow(''),
});

// Generate email route
router.post('/generate-email', validateRequest(generateEmailSchema), generateEmail);

module.exports = router; 