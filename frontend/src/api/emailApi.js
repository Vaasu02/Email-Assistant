import api from './index';

// Get all emails
export const getAllEmails = async () => {
  const response = await api.get('/emails');
  return response.data;
};

// Get a specific email by ID
export const getEmailById = async (id) => {
  const response = await api.get(`/emails/${id}`);
  return response.data;
};

// Create a new email draft
export const createEmail = async (emailData) => {
  const response = await api.post('/emails', emailData);
  return response.data;
};

// Update an existing email
export const updateEmail = async (id, emailData) => {
  const response = await api.put(`/emails/${id}`, emailData);
  return response.data;
};

// Delete an email
export const deleteEmail = async (id) => {
  const response = await api.delete(`/emails/${id}`);
  return response.data;
};

// Send an email
export const sendEmail = async (id, recipientData) => {
  const response = await api.post(`/emails/${id}/send`, recipientData);
  return response.data;
}; 