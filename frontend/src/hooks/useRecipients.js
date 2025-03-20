import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  getAllRecipients,
  getRecipientById,
  createRecipient,
  updateRecipient,
  deleteRecipient,
} from '../api/recipientApi';

export const useRecipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all recipients
  const fetchRecipients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRecipients();
      setRecipients(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch recipients');
      toast.error('Failed to fetch recipients');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific recipient by ID
  const fetchRecipientById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRecipientById(id);
      setCurrentRecipient(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch recipient');
      toast.error('Failed to fetch recipient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new recipient
  const addRecipient = useCallback(async (recipientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createRecipient(recipientData);
      setRecipients((prevRecipients) => [...prevRecipients, response.data]);
      toast.success('Recipient added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add recipient');
      toast.error('Failed to add recipient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing recipient
  const updateExistingRecipient = useCallback(async (id, recipientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateRecipient(id, recipientData);
      setRecipients((prevRecipients) =>
        prevRecipients.map((recipient) =>
          recipient._id === id ? response.data : recipient
        )
      );
      setCurrentRecipient(response.data);
      toast.success('Recipient updated successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update recipient');
      toast.error('Failed to update recipient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a recipient
  const removeRecipient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRecipient(id);
      setRecipients((prevRecipients) =>
        prevRecipients.filter((recipient) => recipient._id !== id)
      );
      toast.success('Recipient deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete recipient');
      toast.error('Failed to delete recipient');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recipients when the component mounts
  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  return {
    recipients,
    currentRecipient,
    loading,
    error,
    fetchRecipients,
    fetchRecipientById,
    addRecipient,
    updateExistingRecipient,
    removeRecipient,
  };
}; 