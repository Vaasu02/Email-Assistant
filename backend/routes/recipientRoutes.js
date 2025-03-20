const express = require('express');
const {
  createRecipient,
  getRecipient,
  getRecipients,
  updateRecipient,
  deleteRecipient,
} = require('../controllers/recipientController');
const validateRequest = require('../middleware/validator');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const createRecipientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const updateRecipientSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
}).min(1); // At least one field must be provided

// Routes
router.post('/', validateRequest(createRecipientSchema), createRecipient);
router.get('/', getRecipients);
router.get('/:id', getRecipient);
router.put('/:id', validateRequest(updateRecipientSchema), updateRecipient);
router.delete('/:id', deleteRecipient);

module.exports = router; 