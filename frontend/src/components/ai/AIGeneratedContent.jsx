import React from 'react';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import './AIGeneratedContent.css';

const AIGeneratedContent = ({
  content,
  isLoading,
  onUseContent,
  onRegenerate,
  onCancel,
}) => {
  if (isLoading) {
    return (
      <div className="ai-generated-loading">
        <Spinner size="large" />
        <p>Generating your email content...</p>
      </div>
    );
  }

  if (!content || !content.subject || !content.body) {
    return null;
  }

  return (
    <div className="ai-generated-content">
      <div className="ai-generated-header">
        <h3>Generated Content</h3>
        <p className="ai-generated-description">
          Review the generated content below. You can use it as is or regenerate for different variations.
        </p>
      </div>

      <div className="ai-generated-preview">
        <div className="ai-generated-subject">
          <strong>Subject:</strong> {content.subject}
        </div>
        <div className="ai-generated-body">
          {content.body.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      <div className="ai-generated-actions">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          Regenerate
        </Button>
        <Button
          variant="primary"
          onClick={onUseContent}
          disabled={isLoading}
        >
          Use This Content
        </Button>
      </div>
    </div>
  );
};

export default AIGeneratedContent; 