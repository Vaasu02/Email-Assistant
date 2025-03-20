const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    promptUsed: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'failed'],
      default: 'draft',
    },
    recipientEmail: {
      type: String,
      trim: true,
    },
    recipientName: {
      type: String,
      trim: true,
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipient'
    }],
    sentAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model('Email', emailSchema);

module.exports = Email; 