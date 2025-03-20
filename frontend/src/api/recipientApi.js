import api from './index';

// Get all recipients
export const getAllRecipients = async () => {
  const response = await api.get('/recipients');
  return response.data;
};

// Get a specific recipient by ID
export const getRecipientById = async (id) => {
  const response = await api.get(`/recipients/${id}`);
  return response.data;
};

// Create a new recipient
export const createRecipient = async (recipientData) => {
  const response = await api.post('/recipients', recipientData);
  return response.data;
};

// Update an existing recipient
export const updateRecipient = async (id, recipientData) => {
  const response = await api.put(`/recipients/${id}`, recipientData);
  return response.data;
};

// Delete a recipient
export const deleteRecipient = async (id) => {
  const response = await api.delete(`/recipients/${id}`);
  return response.data;
}; 