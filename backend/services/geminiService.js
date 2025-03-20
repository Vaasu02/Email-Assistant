const { getGeminiModel } = require('../config/gemini');

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateEmailContent = async (prompt, recipientName, additionalContext = '') => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = getGeminiModel();
      
      // Format the prompt for better results
      const formattedPrompt = `
        Generate a professional email with the following requirements:
        
        Context: ${prompt}
        Recipient Name: ${recipientName || 'Recipient'}
        Additional Context: ${additionalContext || 'None'}
        
        Please format the response with:
        1. A clear subject line
        2. Proper greeting
        3. Professional body content
        4. Appropriate closing
        
        Return the result in plain text format with a clear "Subject:" line followed by the email body.
      `;
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }]
      });
      
      const response = await result.response;
      const text = response.text();
      
      console.log('API Raw Response:', text);
      
      // Extract subject and body from the text response
      try {
        // Split the text into lines and remove empty lines
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Find the subject line
        const subjectLineIndex = lines.findIndex(line => 
          line.toLowerCase().includes('subject:') || 
          line.toLowerCase().startsWith('subject')
        );
        
        let subject = '';
        let body = '';
        
        if (subjectLineIndex >= 0) {
          // Extract subject
          const subjectLine = lines[subjectLineIndex];
          subject = subjectLine.split(':')[1]?.trim() || 'Generated Email';
          
          // Everything after the subject line is the body
          body = lines.slice(subjectLineIndex + 1).join('\n').trim();
        } else {
          // No explicit subject found, use first line as subject
          subject = lines[0] || 'Generated Email';
          body = lines.slice(1).join('\n').trim() || 'No content generated.';
        }
        
        // Ensure we have valid content
        if (!subject || !body) {
          throw new Error('Failed to generate valid email content');
        }
        
        // Return the formatted response
        return {
          success: true,
          data: {
            subject,
            body,
            promptUsed: prompt
          }
        };
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        lastError = new Error('Failed to parse email content: ' + parseError.message);
        continue;
      }
    } catch (error) {
      console.error(`Gemini API error (attempt ${attempt}/${MAX_RETRIES}):`, error);
      lastError = error;
      
      // If this is not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }
    }
  }
  
  // If we get here, all attempts failed
  throw new Error(`Failed to generate email content after ${MAX_RETRIES} attempts: ${lastError.message}`);
};

module.exports = { generateEmailContent }; 