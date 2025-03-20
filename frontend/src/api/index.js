import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://email-assistant-a2ge.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export const emailApi = {
  getAll: () => api.get('/emails'),
  getById: (id) => api.get(`/emails/${id}`),
  create: (data) => api.post('/emails', data),
  update: (id, data) => api.put(`/emails/${id}`, data),
  delete: (id) => api.delete(`/emails/${id}`),
  send: (id) => api.post(`/emails/${id}/send`),
};

export const recipientApi = {
  getAll: () => api.get('/recipients'),
  getById: (id) => api.get(`/recipients/${id}`),
  create: (data) => api.post('/recipients', data),
  update: (id, data) => api.put(`/recipients/${id}`, data),
  delete: (id) => api.delete(`/recipients/${id}`),
};

export const aiApi = {
  generateEmail: (promptData) => api.post('/gemini/generate-email', promptData),
};

export default api; 