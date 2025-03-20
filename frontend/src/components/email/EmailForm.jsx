import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import './EmailForm.css';

const EmailForm = ({
  email,
  onSubmit,
  onCancel,
  isLoading,
  recipients = [],
  onAddRecipient,
}) => {
  const [formData, setFormData] = useState({
    subject: email?.subject || '',
    body: email?.body || email?.content || '',
    recipient_ids: email?.recipients?.map(r => r._id) || [],
    promptUsed: email?.promptUsed || '',
  });
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);

  // Update formData when email changes
  useEffect(() => {
    if (email) {
      setFormData(prev => ({
        ...prev,
        subject: email.subject || '',
        body: email.body || email.content || '',
        recipient_ids: email.recipients?.map(r => r._id) || [],
        promptUsed: email.promptUsed || '',
      }));
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    if (!newRecipientEmail || !newRecipientName) {
      alert('Please enter both name and email for the recipient');
      return;
    }

    setIsAddingRecipient(true);
    try {
      const newRecipient = await onAddRecipient({
        name: newRecipientName,
        email: newRecipientEmail
      });

      if (newRecipient) {
        // Add to formData
        setFormData(prev => ({
          ...prev,
          recipient_ids: [...prev.recipient_ids, newRecipient._id]
        }));

        // Clear the input fields
        setNewRecipientEmail('');
        setNewRecipientName('');
      }
    } catch (error) {
      alert('Failed to add recipient: ' + error.message);
    } finally {
      setIsAddingRecipient(false);
    }
  };

  const handleRecipientToggle = (recipientId) => {
    setFormData(prev => ({
      ...prev,
      recipient_ids: prev.recipient_ids.includes(recipientId)
        ? prev.recipient_ids.filter(id => id !== recipientId)
        : [...prev.recipient_ids, recipientId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.body || !formData.promptUsed) {
      alert('Please fill in all required fields');
      return;
    }
    if (!formData.recipient_ids.length) {
      alert('Please add at least one recipient');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <div className="email-form-header">
        <h2>{email ? 'Edit Email' : 'New Email'}</h2>
      </div>

      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
      />

      <div className="email-form-content">
        <label className="email-form-label">Content</label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          className="email-form-textarea"
          rows="10"
        />
      </div>

      <Input
        label="Prompt Used"
        name="promptUsed"
        value={formData.promptUsed}
        onChange={handleChange}
        required
      />

      <div className="email-form-recipients">
        <label className="email-form-label">Recipients</label>
        
        {/* Add new recipient form */}
        <div className="email-form-add-recipient">
          <Input
            label="Recipient Name"
            value={newRecipientName}
            onChange={(e) => setNewRecipientName(e.target.value)}
            placeholder="Enter recipient name"
            disabled={isAddingRecipient}
          />
          <Input
            label="Recipient Email"
            value={newRecipientEmail}
            onChange={(e) => setNewRecipientEmail(e.target.value)}
            placeholder="Enter recipient email"
            type="email"
            disabled={isAddingRecipient}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddRecipient}
            disabled={isAddingRecipient}
          >
            {isAddingRecipient ? <Spinner size="small" /> : 'Add Recipient'}
          </Button>
        </div>

        {/* Recipients list */}
        <div className="email-form-recipients-list">
          {recipients.map(recipient => (
            <div key={recipient._id} className="email-form-recipient">
              <input
                type="checkbox"
                id={`recipient-${recipient._id}`}
                checked={formData.recipient_ids.includes(recipient._id)}
                onChange={() => handleRecipientToggle(recipient._id)}
              />
              <label htmlFor={`recipient-${recipient._id}`}>
                {recipient.name} ({recipient.email})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="email-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !formData.subject || !formData.body || !formData.promptUsed || !formData.recipient_ids.length}
        >
          {isLoading ? <Spinner size="small" /> : email ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default EmailForm; 