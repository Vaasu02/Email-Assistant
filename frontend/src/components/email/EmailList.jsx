import React from 'react';
import { formatDate, truncateText, formatEmailStatus } from '../../utils/formatters';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import './EmailList.css';

const EmailList = ({ emails, onSelectEmail, onDeleteEmail, onSendEmail, isLoading, sendingEmailId }) => {
  if (isLoading) {
    return (
      <div className="email-list-loading">
        <Spinner size="large" />
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="email-list-empty">
        <p>No emails found. Create a new email to get started!</p>
      </div>
    );
  }

  const handleSendEmail = (email) => {
    if (!email.recipients || email.recipients.length === 0) {
      alert('Please add at least one recipient before sending the email');
      return;
    }

    // Get the recipient IDs, handling both populated and unpopulated cases
    const recipientIds = email.recipients.map(r => {
      if (typeof r === 'string') return r; // If it's already an ID
      return r._id; // If it's a populated recipient object
    }).filter(id => id); // Remove any null/undefined values

    if (recipientIds.length === 0) {
      alert('No valid recipients found');
      return;
    }

    onSendEmail(email._id, { recipient_ids: recipientIds });
  };

  return (
    <div className="email-list">
      {emails.map((email) => (
        <div key={email._id} className="email-item">
          <div className="email-item-content" onClick={() => onSelectEmail(email)}>
            <div className="email-item-header">
              <h3 className="email-item-subject">{truncateText(email.subject, 50)}</h3>
              <span className={`email-item-status email-status-${email.status}`}>
                {formatEmailStatus(email.status)}
              </span>
            </div>
            <p className="email-item-preview">{truncateText(email.body || email.content, 100)}</p>
            <div className="email-item-footer">
              <span className="email-item-date">{formatDate(email.created_at)}</span>
              <span className="email-item-recipients">
                To: {email.recipients?.length || 0} recipients
              </span>
            </div>
          </div>
          <div className="email-item-actions">
            {email.status === 'draft' && (
              <Button
                variant="primary"
                onClick={() => handleSendEmail(email)}
                className="email-item-send"
                disabled={sendingEmailId === email._id}
              >
                {sendingEmailId === email._id ? (
                  <>
                    <Spinner size="small" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => onDeleteEmail(email._id)}
              className="email-item-delete"
              disabled={sendingEmailId === email._id}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList; 