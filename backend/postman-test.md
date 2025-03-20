# Testing the Email Generator API with Postman

## 1. Set Up Environment

First, make sure your server is running:
```
cd backend
npm run dev
```

## 2. Health Check API

Create a GET request:
- URL: `http://localhost:5000/api/health`
- Method: GET

Expected response:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## 3. Test Email Generation

Create a POST request:
- URL: `http://localhost:5000/api/gemini/generate-email`
- Method: POST
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "prompt": "Write a professional email requesting a meeting",
  "recipientName": "John Doe",
  "additionalContext": "We've previously discussed collaboration opportunities"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Email generated successfully",
  "data": {
    "subject": "Meeting Request: Collaboration Opportunities",
    "body": "Dear John Doe,\n\nI hope this email finds you well...",
    "promptUsed": "Write a professional email requesting a meeting"
  }
}
```

## 4. Create Email Draft

Create a POST request:
- URL: `http://localhost:5000/api/emails`
- Method: POST
- Headers: `Content-Type: application/json`
- Body (raw JSON) - use content from previous response:
```json
{
  "subject": "Meeting Request: Collaboration Opportunities",
  "body": "Dear John Doe,\n\nI hope this email finds you well...",
  "promptUsed": "Write a professional email requesting a meeting",
  "recipientEmail": "john.doe@example.com",
  "recipientName": "John Doe"
}
```

Expected response - note the email ID for future requests:
```json
{
  "success": true,
  "message": "Email draft created successfully",
  "data": {
    "_id": "6123456789abcdef12345678",
    "subject": "Meeting Request: Collaboration Opportunities",
    "body": "Dear John Doe,\n\nI hope this email finds you well...",
    "promptUsed": "Write a professional email requesting a meeting",
    "status": "draft",
    "recipientEmail": "john.doe@example.com",
    "recipientName": "John Doe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## 5. Get Email Draft

Create a GET request:
- URL: `http://localhost:5000/api/emails/:id` (replace `:id` with the email ID from previous response)
- Method: GET

## 6. Update Email Draft

Create a PUT request:
- URL: `http://localhost:5000/api/emails/:id` (replace `:id` with the email ID)
- Method: PUT
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "subject": "Updated Meeting Request",
  "body": "Dear John Doe,\n\nI hope this email finds you well. I'd like to schedule a meeting for next week if possible...\n\nBest regards,\nYour Name"
}
```

## 7. Send Email

Create a POST request:
- URL: `http://localhost:5000/api/emails/:id/send` (replace `:id` with the email ID)
- Method: POST
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "recipientEmail": "actual-recipient@example.com",
  "recipientName": "Actual Recipient"
}
```

Note: This will attempt to send a real email using your configured email service.

## 8. Get All Emails

Create a GET request:
- URL: `http://localhost:5000/api/emails`
- Method: GET

## 9. Delete Email

Create a DELETE request:
- URL: `http://localhost:5000/api/emails/:id` (replace `:id` with the email ID)
- Method: DELETE

## Troubleshooting

If you encounter errors:

1. Check the server console logs for detailed error messages
2. Verify your Gemini API key is correct
3. Make sure MongoDB is running
4. For email sending issues, verify your email configuration
5. When getting `Cast to ObjectId failed` errors:
   - Make sure you're using the correct and complete MongoDB ID
   - MongoDB ObjectIds must be 24 characters long
   - This error typically occurs when trying to access, update, or delete an item with an invalid ID
   - The API now validates IDs and will return a 400 error with a message like "Invalid email ID format"

## Common Errors and Solutions

### "Cast to ObjectId failed"
- Problem: The ID used is not a valid MongoDB ObjectId
- Solution: Make sure you're using the complete ID returned when creating the email (should be 24 characters)

### "Email not found"
- Problem: The ID is valid but no email with that ID exists
- Solution: Check if the email was deleted or if you're using the correct ID

### Gemini API Errors
- Problem: Errors related to Gemini API key or model
- Solution: Verify your API key is correct and the model name is available

### MongoDB Connection Issues
- Problem: "MongoNetworkError" or connection-related errors
- Solution: Ensure MongoDB is running and accessible at the URI specified in your .env file 