const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient; 