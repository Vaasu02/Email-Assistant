import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { generateEmail } from '../api/aiApi';

export const useAiGeneration = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate email content using AI
  const generateEmailContent = useCallback(async (promptData) => {
    setLoading(true);
    setError(null);
    setGeneratedContent(null);
    
    try {
      // Validate the prompt data before sending
      if (!promptData || typeof promptData !== 'object' || !promptData.prompt) {
        throw new Error('Invalid prompt data');
      }
      
      const response = await generateEmail(promptData);
      
      // Ensure we're getting a proper response
      if (!response || !response.data || !response.data.success) {
        throw new Error('No valid response received from the server');
      }
      
      const { data } = response.data;
      
      if (!data.subject || !data.body) {
        throw new Error('AI did not generate valid email content');
      }
      
      setGeneratedContent(data);
      toast.success('Email content generated successfully');
      return data;
    } catch (err) {
      console.error('AI Generation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate email content';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear generated content
  const clearGeneratedContent = useCallback(() => {
    setGeneratedContent(null);
    setError(null);
  }, []);

  return {
    generatedContent,
    isLoading: loading,
    error,
    generateEmailContent,
    clearGeneratedContent,
  };
}; 