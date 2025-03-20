const asyncHandler = require('../utils/asyncHandler');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const mongoose = require('mongoose');
const {
  createEmailDraft,
  updateEmailDraft,
  sendGeneratedEmail,
  getEmailById,
  getAllEmails,
  deleteEmail,
} = require('../services/emailService');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create a new email draft
const createEmail = asyncHandler(async (req, res) => {
  const { subject, body, promptUsed, recipientName, recipientEmail, recipient_ids } = req.body;

  if (!subject || !body || !promptUsed) {
    return res.status(400).json(formatErrorResponse('Subject, body and promptUsed are required', 400));
  }

  try {
    // Handle recipient_ids if provided
    let recipients = [];
    if (recipient_ids && Array.isArray(recipient_ids)) {
      // Validate that all IDs are valid MongoDB ObjectIds
      const validIds = recipient_ids.every(id => isValidObjectId(id));
      if (!validIds) {
        return res.status(400).json(formatErrorResponse('Invalid recipient ID format', 400));
      }
      recipients = recipient_ids;
    }

    const newEmail = await createEmailDraft({
      subject,
      body,
      promptUsed,
      recipientName,
      recipientEmail,
      recipients
    });

    res.status(201).json(formatSuccessResponse(newEmail, 'Email draft created successfully'));
  } catch (error) {
    console.error('Error in createEmail controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Update an existing email draft
const updateEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid email ID format', 400));
  }

  try {
    // Handle recipient_ids specially to ensure they're properly saved
    if (updateData.recipient_ids && Array.isArray(updateData.recipient_ids)) {
      // Validate that all IDs are valid MongoDB ObjectIds
      const validIds = updateData.recipient_ids.every(id => isValidObjectId(id));
      if (!validIds) {
        return res.status(400).json(formatErrorResponse('Invalid recipient ID format', 400));
      }
      
      // Add recipients field to update data
      updateData.recipients = updateData.recipient_ids;
    }

    const updatedEmail = await updateEmailDraft(id, updateData);
    res.status(200).json(formatSuccessResponse(updatedEmail, 'Email draft updated successfully'));
  } catch (error) {
    console.error('Error in updateEmail controller:', error);
    if (error.message === 'Email not found') {
      return res.status(404).json(formatErrorResponse('Email not found', 404));
    }
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Send an email
const sendEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { recipientEmail, recipientName, recipient_ids } = req.body;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid email ID format', 400));
  }

  try {
    // If recipient_ids is provided, use them instead of single recipient
    if (recipient_ids && recipient_ids.length > 0) {
      const result = await sendGeneratedEmail(id, null, null, recipient_ids);
      return res.status(200).json(formatSuccessResponse({
        email: result.email,
        messageId: result.messageId
      }, 'Email sent successfully'));
    }

    // Fall back to single recipient if recipient_ids not provided
    const result = await sendGeneratedEmail(id, recipientEmail, recipientName);
    res.status(200).json(formatSuccessResponse({
      email: result.email,
      messageId: result.messageId
    }, 'Email sent successfully'));
  } catch (error) {
    console.error('Error in sendEmail controller:', error);
    if (error.message === 'Email not found') {
      return res.status(404).json(formatErrorResponse('Email not found', 404));
    }
    if (error.message === 'Recipient email is required') {
      return res.status(400).json(formatErrorResponse('Recipient email is required', 400));
    }
    res.status(500).json(formatErrorResponse('Failed to send email: ' + error.message, 500));
  }
});

// Get a specific email by ID
const getEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid email ID format', 400));
  }

  try {
    const email = await getEmailById(id);
    res.status(200).json(formatSuccessResponse(email, 'Email retrieved successfully'));
  } catch (error) {
    console.error('Error in getEmail controller:', error);
    if (error.message === 'Email not found') {
      return res.status(404).json(formatErrorResponse('Email not found', 404));
    }
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Get all emails
const getEmails = asyncHandler(async (req, res) => {
  try {
    const emails = await getAllEmails();
    res.status(200).json(formatSuccessResponse(emails, 'Emails retrieved successfully'));
  } catch (error) {
    console.error('Error in getEmails controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Delete an email
const removeEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid email ID format', 400));
  }

  try {
    await deleteEmail(id);
    res.status(200).json(formatSuccessResponse(null, 'Email deleted successfully'));
  } catch (error) {
    console.error('Error in removeEmail controller:', error);
    if (error.message === 'Email not found') {
      return res.status(404).json(formatErrorResponse('Email not found', 404));
    }
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

module.exports = {
  createEmail,
  updateEmail,
  sendEmail,
  getEmail,
  getEmails,
  removeEmail,
}; 