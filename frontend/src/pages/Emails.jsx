import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmailList from '../components/email/EmailList';
import EmailForm from '../components/email/EmailForm';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useEmails } from '../hooks/useEmails';
import { useRecipients } from '../hooks/useRecipients';
import './Emails.css';

const Emails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [sendingEmailId, setSendingEmailId] = useState(null);

  const {
    emails,
    isLoading: emailsLoading,
    createEmailDraft,
    updateEmailDraft,
    removeEmail,
    sendEmailToRecipient,
  } = useEmails();

  const {
    recipients,
    isLoading: recipientsLoading,
    fetchRecipients,
    addRecipient,
  } = useRecipients();

  // Fetch recipients when component mounts
  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  // Handle generated content from AI page
  useEffect(() => {
    if (location.state?.newEmail) {
      setSelectedEmail(location.state.newEmail);
      setShowForm(true);
      // Clear the location state to prevent showing the form again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleCreateEmail = async (formData) => {
    await createEmailDraft(formData);
    setShowForm(false);
  };

  const handleUpdateEmail = async (formData) => {
    if (!selectedEmail?._id) {
      console.error('No email ID found for update');
      return;
    }
    await updateEmailDraft(selectedEmail._id, formData);
    setSelectedEmail(null);
    setShowForm(false);
  };

  const handleDeleteEmail = async (emailId) => {
    await removeEmail(emailId);
  };

  const handleSendEmail = async (emailId, recipientData) => {
    if (!recipientData?.recipient_ids?.length) {
      alert('Please add at least one recipient before sending the email');
      return;
    }

    setSendingEmailId(emailId);
    try {
      await sendEmailToRecipient(emailId, recipientData);
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedEmail(null);
  };

  const handleAddRecipient = async (recipientData) => {
    try {
      const newRecipient = await addRecipient(recipientData);
      if (newRecipient) {
        // Refresh the recipients list
        await fetchRecipients();
        return newRecipient;
      }
      return null;
    } catch (error) {
      console.error('Failed to add recipient:', error);
      throw error;
    }
  };

  if (showForm) {
    return (
      <div className="emails-page">
        {recipientsLoading ? (
          <div className="loading-container">
            <Spinner size="large" />
            <p>Loading recipients...</p>
          </div>
        ) : (
          <EmailForm
            email={selectedEmail}
            onSubmit={selectedEmail?._id ? handleUpdateEmail : handleCreateEmail}
            onCancel={handleCancel}
            isLoading={emailsLoading}
            recipients={recipients}
            onAddRecipient={handleAddRecipient}
          />
        )}
      </div>
    );
  }

  return (
    <div className="emails-page">
      <div className="emails-header">
        <h1>Emails</h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          New Email
        </Button>
      </div>

      <EmailList
        emails={emails}
        onSelectEmail={handleSelectEmail}
        onDeleteEmail={handleDeleteEmail}
        onSendEmail={handleSendEmail}
        isLoading={emailsLoading}
        sendingEmailId={sendingEmailId}
      />
    </div>
  );
};

export default Emails; 