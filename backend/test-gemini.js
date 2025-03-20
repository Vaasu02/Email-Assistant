require('dotenv').config();
const { getGeminiModel } = require('./config/gemini');

async function testGeminiApi() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('ERROR: GEMINI_API_KEY is missing in .env file');
      return;
    }
    
    console.log('Testing Gemini API...');
    console.log('API Key (first few chars):', process.env.GEMINI_API_KEY?.substring(0, 5) + '...');
    
    const model = getGeminiModel();
    console.log('Model initialized');
    
    const prompt = 'Write a short greeting';
    
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 100,
    };

    console.log('Sending request to Gemini API...');
    console.log('Using model configuration:', { model: model.modelName });
    
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    });

    console.log('Response received');
    const response = result.response;
    const text = response.text();
    
    console.log('Generated text:', text);
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    
    // More detailed error info
    if (error.message && error.message.includes('404')) {
      console.error('\nPOSSIBLE SOLUTION: The model may not be available. Try a different model name in config/gemini.js');
    }
    
    if (error.message && error.message.includes('403')) {
      console.error('\nPOSSIBLE SOLUTION: Your API key may be invalid or not have access to this model.');
    }
    
    if (error.message && error.message.includes('429')) {
      console.error('\nPOSSIBLE SOLUTION: You may have exceeded your quota. Check your Google Cloud console.');
    }
  }
}

testGeminiApi(); 