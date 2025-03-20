const { sendEmail } = require('../config/nodemailer');
const Email = require('../models/Email');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const createEmailDraft = async (emailData) => {
  try {
    const email = new Email({
      subject: emailData.subject,
      body: emailData.body,
      promptUsed: emailData.promptUsed,
      recipientName: emailData.recipientName,
      recipientEmail: emailData.recipientEmail,
      recipients: emailData.recipients || []
    });

    const savedEmail = await email.save();
    return savedEmail;
  } catch (error) {
    console.error('Error creating email draft:', error);
    throw error;
  }
};

const updateEmailDraft = async (emailId, updateData) => {
  try {
    if (!isValidObjectId(emailId)) {
      throw new Error('Invalid email ID format');
    }
    
    const email = await Email.findByIdAndUpdate(
      emailId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!email) {
      throw new Error('Email not found');
    }

    return email;
  } catch (error) {
    console.error('Error updating email draft:', error);
    throw error;
  }
};

const sendGeneratedEmail = async (emailId, recipientEmail, recipientName, recipient_ids = []) => {
  try {
    if (!isValidObjectId(emailId)) {
      throw new Error('Invalid email ID format');
    }
    
    const email = await Email.findById(emailId).populate('recipients');

    if (!email) {
      throw new Error('Email not found');
    }

    // Process multiple recipients if recipient_ids are provided
    if (recipient_ids && recipient_ids.length > 0) {
      // Find recipients from the database
      const Recipient = mongoose.model('Recipient');
      const recipients = await Recipient.find({ _id: { $in: recipient_ids } });
      
      if (!recipients || recipients.length === 0) {
        throw new Error('No valid recipients found with the provided IDs');
      }
      
      // Update the email with the selected recipients
      email.recipients = recipients.map(r => r._id);
      
      // Create HTML version of the email
      const htmlBody = email.body.replace(/\n/g, '<br>');
      
      // Send to each recipient
      const sendPromises = recipients.map(recipient => {
        return sendEmail({
          to: recipient.email,
          subject: email.subject,
          html: htmlBody,
        });
      });
      
      const results = await Promise.all(sendPromises);
      
      // Check if all emails were sent successfully
      const allSuccessful = results.every(result => result.success);
      
      if (!allSuccessful) {
        const errors = results
          .filter(result => !result.success)
          .map(result => result.error)
          .join(', ');
        throw new Error(`Failed to send some emails: ${errors}`);
      }
      
      // Update the email status
      email.status = 'sent';
      email.sentAt = Date.now();
      
      await email.save();
      
      return { email, messageId: results[0].messageId };
    }

    // Single recipient flow (existing code)
    const to = recipientEmail || email.recipientEmail;
    const name = recipientName || email.recipientName;
    
    if (!to) {
      throw new Error('Recipient email is required');
    }

    // Create HTML version of the email
    const htmlBody = email.body.replace(/\n/g, '<br>');
    
    // Send the email
    const result = await sendEmail({
      to,
      subject: email.subject,
      html: htmlBody,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    // Update the email status
    email.status = 'sent';
    email.sentAt = Date.now();
    email.recipientEmail = to;
    email.recipientName = name;
    
    await email.save();

    return { email, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Update email status to failed if it exists and is a valid ID
    if (emailId && isValidObjectId(emailId)) {
      try {
        await Email.findByIdAndUpdate(emailId, { 
          status: 'failed',
          updatedAt: Date.now()
        });
      } catch (updateError) {
        console.error('Error updating email status:', updateError);
      }
    }
    
    throw error;
  }
};

const getEmailById = async (emailId) => {
  try {
    if (!isValidObjectId(emailId)) {
      throw new Error('Invalid email ID format');
    }
    
    const email = await Email.findById(emailId).populate('recipients');
    
    if (!email) {
      throw new Error('Email not found');
    }
    
    return email;
  } catch (error) {
    console.error('Error fetching email:', error);
    throw error;
  }
};

const getAllEmails = async () => {
  try {
    const emails = await Email.find()
      .populate('recipients')
      .sort({ createdAt: -1 });
    return emails;
  } catch (error) {
    console.error('Error fetching all emails:', error);
    throw error;
  }
};

const deleteEmail = async (emailId) => {
  try {
    if (!isValidObjectId(emailId)) {
      throw new Error('Invalid email ID format');
    }
    
    const email = await Email.findByIdAndDelete(emailId);
    
    if (!email) {
      throw new Error('Email not found');
    }
    
    return email;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
};

module.exports = {
  createEmailDraft,
  updateEmailDraft,
  sendGeneratedEmail,
  getEmailById,
  getAllEmails,
  deleteEmail,
}; 