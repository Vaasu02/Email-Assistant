# AI Email Generator Backend

This is the backend for an AI-powered email generator application built with Node.js, Express, MongoDB, Gemini API, and Nodemailer.

## Features

- Generate professional emails using Google's Gemini AI
- Store email drafts in MongoDB
- Edit and update email content
- Send emails via Nodemailer
- Manage recipients

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gemini API key
- Email account for sending emails (Gmail recommended)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/email-generator
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

For Gmail, you'll need to create an app password: https://support.google.com/accounts/answer/185833

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Gemini AI

- `POST /api/gemini/generate-email` - Generate email content using AI

### Emails

- `GET /api/emails` - Get all emails
- `GET /api/emails/:id` - Get specific email
- `POST /api/emails` - Create email draft
- `PUT /api/emails/:id` - Update email draft
- `DELETE /api/emails/:id` - Delete email
- `POST /api/emails/:id/send` - Send specific email

### Recipients

- `GET /api/recipients` - Get all recipients
- `GET /api/recipients/:id` - Get specific recipient
- `POST /api/recipients` - Create recipient
- `PUT /api/recipients/:id` - Update recipient
- `DELETE /api/recipients/:id` - Delete recipient

## Request Examples

### Generate Email

```json
POST /api/gemini/generate-email
{
  "prompt": "Write a professional email requesting a meeting",
  "recipientName": "John Doe",
  "additionalContext": "We've previously discussed collaboration opportunities"
}
```

### Create Email Draft

```json
POST /api/emails
{
  "subject": "Meeting Request",
  "body": "Dear John,\n\nI hope this email finds you well...",
  "promptUsed": "Write a professional email requesting a meeting",
  "recipientEmail": "john@example.com",
  "recipientName": "John Doe"
}
```

### Send Email

```json
POST /api/emails/:id/send
{
  "recipientEmail": "john@example.com",
  "recipientName": "John Doe"
}
``` 