import api from './index';

/**
 * Generate email content using AI
 * @param {Object} promptData - The prompt data for email generation
 * @param {string} promptData.prompt - The main prompt text
 * @param {string} [promptData.recipientName] - Optional recipient name
 * @param {string} [promptData.additionalContext] - Optional additional context
 * @returns {Promise<Object>} The API response
 */
export const generateEmail = async (promptData) => {
  // Ensure we have a properly formatted object
  const data = {
    prompt: promptData.prompt || '',
    recipientName: promptData.recipientName || '',
    additionalContext: promptData.additionalContext || ''
  };
  
  const response = await api.post('/gemini/generate-email', data);
  return response;
}; 