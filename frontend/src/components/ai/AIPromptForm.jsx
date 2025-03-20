import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import './AIPromptForm.css';

const AIPromptForm = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <form className="ai-prompt-form" onSubmit={handleSubmit}>
      <div className="ai-prompt-header">
        <h2>Generate Email Content</h2>
        <p className="ai-prompt-description">
          Describe the email you want to create, and our AI will help you generate the content.
        </p>
      </div>

      <div className="ai-prompt-content">
        <label className="ai-prompt-label">Your Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Write a professional email to schedule a meeting with the marketing team to discuss Q2 strategy"
          className="ai-prompt-textarea"
          rows="4"
          required
        />
      </div>

      <div className="ai-prompt-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !prompt.trim()}
          className="ai-prompt-submit"
        >
          {isLoading ? (
            <>
              <Spinner size="small" />
              <span>Generating...</span>
            </>
          ) : (
            'Generate Content'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AIPromptForm; 