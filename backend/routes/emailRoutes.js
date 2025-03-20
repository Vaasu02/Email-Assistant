const express = require('express');
const {
  createEmail,
  updateEmail,
  sendEmail,
  getEmail,
  getEmails,
  removeEmail,
} = require('../controllers/emailController');
const validateRequest = require('../middleware/validator');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const createEmailSchema = Joi.object({
  subject: Joi.string().required(),
  body: Joi.string().required(),
  promptUsed: Joi.string().required(),
  recipientName: Joi.string().allow(''),
  recipientEmail: Joi.string().email().allow(''),
  recipient_ids: Joi.array().items(Joi.string())
});

const updateEmailSchema = Joi.object({
  subject: Joi.string(),
  body: Joi.string(),
  promptUsed: Joi.string(),
  recipientName: Joi.string().allow(''),
  recipientEmail: Joi.string().email().allow(''),
  recipient_ids: Joi.array().items(Joi.string())
});

const sendEmailSchema = Joi.object({
  recipientEmail: Joi.string().email(),
  recipientName: Joi.string().allow(''),
  recipient_ids: Joi.array().items(Joi.string())
});

// Routes
router.post('/', validateRequest(createEmailSchema), createEmail);
router.get('/', getEmails);
router.get('/:id', getEmail);
router.put('/:id', validateRequest(updateEmailSchema), updateEmail);
router.delete('/:id', removeEmail);
router.post('/:id/send', validateRequest(sendEmailSchema), sendEmail);

module.exports = router; 