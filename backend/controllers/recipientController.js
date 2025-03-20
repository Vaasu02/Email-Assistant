const asyncHandler = require('../utils/asyncHandler');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const mongoose = require('mongoose');
const Recipient = require('../models/Recipient');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create a new recipient
const createRecipient = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json(formatErrorResponse('Name and email are required', 400));
  }

  try {
    // Check if recipient already exists
    const existingRecipient = await Recipient.findOne({ email });
    if (existingRecipient) {
      return res.status(400).json(formatErrorResponse('Recipient with this email already exists', 400));
    }

    const recipient = new Recipient({ name, email });
    const savedRecipient = await recipient.save();

    res.status(201).json(formatSuccessResponse(savedRecipient, 'Recipient created successfully'));
  } catch (error) {
    console.error('Error in createRecipient controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Get a specific recipient
const getRecipient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid recipient ID format', 400));
  }

  try {
    const recipient = await Recipient.findById(id);

    if (!recipient) {
      return res.status(404).json(formatErrorResponse('Recipient not found', 404));
    }

    res.status(200).json(formatSuccessResponse(recipient, 'Recipient retrieved successfully'));
  } catch (error) {
    console.error('Error in getRecipient controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Get all recipients
const getRecipients = asyncHandler(async (req, res) => {
  try {
    const recipients = await Recipient.find().sort({ name: 1 });
    res.status(200).json(formatSuccessResponse(recipients, 'Recipients retrieved successfully'));
  } catch (error) {
    console.error('Error in getRecipients controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Update a recipient
const updateRecipient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid recipient ID format', 400));
  }

  if (!name && !email) {
    return res.status(400).json(formatErrorResponse('Name or email is required for update', 400));
  }

  try {
    // If email is being updated, check if it already exists for another recipient
    if (email) {
      const existingRecipient = await Recipient.findOne({ email, _id: { $ne: id } });
      if (existingRecipient) {
        return res.status(400).json(formatErrorResponse('Another recipient with this email already exists', 400));
      }
    }

    const updatedRecipient = await Recipient.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedRecipient) {
      return res.status(404).json(formatErrorResponse('Recipient not found', 404));
    }

    res.status(200).json(formatSuccessResponse(updatedRecipient, 'Recipient updated successfully'));
  } catch (error) {
    console.error('Error in updateRecipient controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

// Delete a recipient
const deleteRecipient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!isValidObjectId(id)) {
    return res.status(400).json(formatErrorResponse('Invalid recipient ID format', 400));
  }

  try {
    const deletedRecipient = await Recipient.findByIdAndDelete(id);

    if (!deletedRecipient) {
      return res.status(404).json(formatErrorResponse('Recipient not found', 404));
    }

    res.status(200).json(formatSuccessResponse(null, 'Recipient deleted successfully'));
  } catch (error) {
    console.error('Error in deleteRecipient controller:', error);
    res.status(500).json(formatErrorResponse(error.message, 500));
  }
});

module.exports = {
  createRecipient,
  getRecipient,
  getRecipients,
  updateRecipient,
  deleteRecipient,
}; 