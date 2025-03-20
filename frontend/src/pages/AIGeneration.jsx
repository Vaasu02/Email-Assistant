import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIPromptForm from '../components/ai/AIPromptForm';
import AIGeneratedContent from '../components/ai/AIGeneratedContent';
import { useAiGeneration } from '../hooks/useAiGeneration';
import './AIGeneration.css';

const AIGeneration = () => {
  const navigate = useNavigate();
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const {
    generatedContent,
    isLoading,
    generateEmailContent,
    clearGeneratedContent,
  } = useAiGeneration();

  const handleGenerate = async (promptText) => {
    // Format the prompt data correctly as an object with expected properties
    const promptData = {
      prompt: promptText,
      recipientName: '',
      additionalContext: ''
    };
    
    await generateEmailContent(promptData);
    setShowGeneratedContent(true);
  };

  const handleRegenerate = () => {
    clearGeneratedContent();
    setShowGeneratedContent(false);
  };

  const handleUseContent = () => {
    // Make sure we have valid content before navigating
    if (!generatedContent || !generatedContent.subject || !generatedContent.body) {
      console.error('No valid content to use');
      return;
    }
    
    // Navigate to the email form with properly formatted content
    navigate('/', { 
      state: { 
        newEmail: {
          subject: generatedContent.subject || '',
          content: generatedContent.body || '',
          recipient_ids: [],
          promptUsed: generatedContent.promptUsed || 'AI Generated Email'
        }
      }
    });
  };

  const handleCancel = () => {
    clearGeneratedContent();
    setShowGeneratedContent(false);
  };

  return (
    <div className="ai-generation-page">
      <div className="ai-generation-header">
        <h1>AI Email Generation</h1>
        <p className="ai-generation-description">
          Use our AI to help you write professional emails. Just describe what you want to say, and we'll generate the content for you.
        </p>
      </div>

      {showGeneratedContent ? (
        <AIGeneratedContent
          content={generatedContent}
          isLoading={isLoading}
          onUseContent={handleUseContent}
          onRegenerate={handleRegenerate}
          onCancel={handleCancel}
        />
      ) : (
        <AIPromptForm
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AIGeneration; 