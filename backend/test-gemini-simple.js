require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('Testing Gemini API with simple prompt...');
    
    // Get API key from .env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('ERROR: GEMINI_API_KEY is missing in .env file');
      return;
    }
    
    console.log('API Key (first few chars):', apiKey.substring(0, 5) + '...');
    
    // Initialize API with the key
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('API initialized');
    
    // Get model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('Using model: gemini-2.0-flash');
    
    // Generate content with a simple prompt
    console.log('Sending request...');
    const result = await model.generateContent({
      contents: [{ parts: [{ text: "Explain how AI works in one sentence" }] }]
    });
    
    console.log('Response received');
    const response = result.response;
    const text = response.text();
    
    console.log('Generated text:', text);
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
  }
}

testGemini(); 