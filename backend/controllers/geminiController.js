const asyncHandler = require('../utils/asyncHandler');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const { generateEmailContent } = require('../services/geminiService');

const generateEmail = asyncHandler(async (req, res) => {
  const { prompt, recipientName, additionalContext } = req.body;

  if (!prompt) {
    return res.status(400).json(formatErrorResponse('Prompt is required', 400));
  }

  try {
    console.log('Generating email with prompt:', prompt);
    
    const result = await generateEmailContent(prompt, recipientName, additionalContext);
    
    // Validate the response
    if (!result.success || !result.data || !result.data.subject || !result.data.body) {
      console.error('Invalid response from Gemini API:', result);
      return res.status(500).json(formatErrorResponse('Failed to generate valid email content', 500));
    }
    
    console.log('Email generated successfully');
    
    res.status(200).json(formatSuccessResponse(result.data, 'Email generated successfully'));
  } catch (error) {
    console.error('Error in generateEmail controller:', error);
    
    // Check for specific API errors
    if (error.message && error.message.includes('API key')) {
      return res.status(401).json(formatErrorResponse('Invalid API key or authentication error', 401));
    }
    
    if (error.message && error.message.includes('model not found')) {
      return res.status(400).json(formatErrorResponse('The specified Gemini model is not available', 400));
    }
    
    res.status(500).json(formatErrorResponse(error.message || 'Failed to generate email', 500));
  }
});

module.exports = {
  generateEmail,
}; 