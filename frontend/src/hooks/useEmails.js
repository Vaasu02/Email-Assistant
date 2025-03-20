import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllEmails, 
  getEmailById, 
  createEmail, 
  updateEmail, 
  deleteEmail, 
  sendEmail 
} from '../api/emailApi';

export const useEmails = () => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all emails
  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEmails();
      setEmails(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch emails');
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific email by ID
  const fetchEmailById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmailById(id);
      setCurrentEmail(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch email');
      toast.error('Failed to fetch email');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new email draft
  const createEmailDraft = useCallback(async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createEmail(emailData);
      setEmails((prevEmails) => [...prevEmails, response.data]);
      toast.success('Email draft created');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create email draft');
      toast.error('Failed to create email draft');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing email
  const updateEmailDraft = useCallback(async (id, emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateEmail(id, emailData);
      setEmails((prevEmails) =>
        prevEmails.map((email) => (email._id === id ? response.data : email))
      );
      setCurrentEmail(response.data);
      toast.success('Email updated');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update email');
      toast.error('Failed to update email');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an email
  const removeEmail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEmail(id);
      setEmails((prevEmails) => prevEmails.filter((email) => email._id !== id));
      toast.success('Email deleted');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete email');
      toast.error('Failed to delete email');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send an email
  const sendEmailToRecipient = useCallback(async (id, recipientData) => {
    setLoading(true);
    setError(null);
    try {
      if (!recipientData.recipient_ids || recipientData.recipient_ids.length === 0) {
        throw new Error('No recipients selected');
      }

      // Check if each recipient_id is valid
      recipientData.recipient_ids.forEach(id => {
        if (!id) {
          throw new Error('Invalid recipient ID found');
        }
      });

      console.log('Sending email with recipient data:', JSON.stringify(recipientData));
      
      const response = await sendEmail(id, recipientData);
      
      // Fetch the complete email data after sending
      const completeEmail = await getEmailById(id);
      
      if (completeEmail) {
        setEmails((prevEmails) =>
          prevEmails.map((email) => (email._id === id ? completeEmail : email))
        );
        
        if (currentEmail && currentEmail._id === id) {
          setCurrentEmail(completeEmail);
        }
      }
      
      toast.success('Email sent successfully');
      return completeEmail;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send email';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentEmail, getEmailById]);

  // Load emails when the component mounts
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return {
    emails,
    currentEmail,
    loading,
    error,
    fetchEmails,
    fetchEmailById,
    createEmailDraft,
    updateEmailDraft,
    removeEmail,
    sendEmailToRecipient,
  };
}; 