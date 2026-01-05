# API Integration Guide

This guide explains how the Bridged Platforms website integrates with the Azure Function Contact Form API.

## Overview

The contact form on the website sends submissions to an Azure Function API endpoint that processes the form data, validates it, and sends email notifications via Mailjet.

## API Endpoint Configuration

The API endpoint is configured using environment variables:

### Development (Local)

For local development, the form connects to your local Azure Function:

```bash
# Create .env file in the project root
VITE_API_URL=http://localhost:7071/api/ContactForm
# Function key is optional for local - Azure Functions Core Tools provides a default
VITE_FUNCTION_KEY=
```

**Note:** For local development, Azure Functions Core Tools automatically provides a default function key. You can leave `VITE_FUNCTION_KEY` empty, or get the key from the function startup logs.

### Production

For production, set the deployed Azure Function URL and function key:

```bash
# .env.production
VITE_API_URL=https://your-function-app.azurewebsites.net/api/ContactForm
VITE_FUNCTION_KEY=your-function-key-from-azure-portal
```

## Azure Function Key Authentication

The Azure Function requires authentication using Azure Function Keys to prevent unauthorized access. The website automatically includes the function key in the request headers.

### Getting Your Function Key

#### For Production (Azure Portal):

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Function App
3. Click on **Functions** in the left menu
4. Select **ContactForm** function
5. Click on **Function Keys** in the function menu
6. Copy the **default** key (or create a new one)
7. Add it to your `.env` file as `VITE_FUNCTION_KEY`

#### For Local Development:

When running `func start`, Azure Functions Core Tools automatically generates a master key. You can:

1. **Option 1:** Leave `VITE_FUNCTION_KEY` empty (works with default key)
2. **Option 2:** Get the key from the function startup logs:
   ```
   Functions:
       ContactForm: [POST,OPTIONS] http://localhost:7071/api/ContactForm
   
   Host Keys:
       master: <your-master-key-here>
   ```
   Use the master key as `VITE_FUNCTION_KEY`

### How It Works

- The function key is sent in the `x-functions-key` header with each request
- Azure Functions automatically validates the key
- If the key is missing or invalid, the function returns `401 Unauthorized`
- This ensures only your website can call the function

## Environment Variables

Create a `.env` file in the project root:

```env
# Azure Function API Endpoint
VITE_API_URL=http://localhost:7071/api/ContactForm

# Azure Function Key for authentication
# Get from Azure Portal > Function > Function Keys (for production)
# Or from func start logs (for local development)
VITE_FUNCTION_KEY=your-function-key-here
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

**Security Note:** Function keys are exposed in client-side code. This is acceptable for this use case since:
- The function key is specific to your function
- CORS is configured to restrict access to your domain
- The function validates all input server-side
- For additional security, consider using Azure API Management or App Service Authentication

## API Request Format

The contact form sends POST requests with JSON data:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to get in touch!"
}
```

## API Response Format

### Success (200 OK)

```json
{
  "success": true,
  "message": "Form submitted successfully!"
}
```

### Error (400 Bad Request)

```json
{
  "error": "Name is required"
}
```

### Error (500 Internal Server Error)

```json
{
  "error": "Internal server error"
}
```

## Form Status Indicators

The contact form displays different status indicators:

### Loading State
- Button shows "Sending..." with a spinner
- Button is disabled during submission
- Blue status message: "Sending message..."

### Success State
- Button shows "Message Sent! ✓"
- Green status message with success icon
- Form fields are cleared
- Success message auto-dismisses after 5 seconds

### Error State
- Button returns to "Send Message"
- Red status message with error icon
- Error message shows the specific error from the API
- Form data is preserved for retry

## Local Development Setup

1. **Start the Azure Function locally:**
   ```bash
   cd ../bridged-platforms-contact-us-function
   func start
   ```

2. **Create `.env` file:**
   ```bash
   echo "VITE_API_URL=http://localhost:7071/api/ContactForm" > .env
   ```

3. **Start the website:**
   ```bash
   npm run dev
   ```

4. **Test the form:**
   - Navigate to the contact section
   - Fill out and submit the form
   - Check the Azure Function logs for the submission
   - Verify email is received at the configured `TO_EMAIL` address

## Production Deployment

1. **Deploy the Azure Function** (see [Azure Function Deployment Guide](../bridged-platforms-contact-us-function/docs/DEPLOYMENT.md))

2. **Get the Function URL:**
   - Azure Portal > Function App > Functions > ContactForm > Get function URL
   - Copy the full URL (includes the `?code=...` parameter if using function keys)

3. **Set environment variable:**
   ```bash
   # For Vercel, Netlify, etc.
   VITE_API_URL=https://your-function-app.azurewebsites.net/api/ContactForm
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   # Deploy the dist folder to your hosting provider
   ```

## Testing

### Test Locally

1. Ensure Azure Function is running: `func start`
2. Open website: `npm run dev`
3. Submit the contact form
4. Check function logs for submission
5. Verify email delivery

### Test in Browser Console

```javascript
// Test the API endpoint directly
fetch('http://localhost:7071/api/ContactForm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Troubleshooting

### Form Not Submitting

- **Check API URL:** Verify `VITE_API_URL` is set correctly
- **Check Function Key:** Verify `VITE_FUNCTION_KEY` is set correctly (required for production)
- **Check CORS:** Ensure Azure Function CORS settings allow your domain
- **Check Network:** Open browser DevTools > Network tab to see the request
- **Check Console:** Look for JavaScript errors in the browser console
- **Check Authentication:** If you see `401 Unauthorized`, the function key is missing or invalid

### CORS Errors

If you see CORS errors in the browser console:

1. **For local development:** CORS is set to `*` by default
2. **For production:** Configure CORS in Azure Portal:
   - Function App > CORS
   - Add your domain: `https://yourdomain.com`
   - Remove `*` if present

### Network Errors

- Verify the Azure Function is running and accessible
- Check the function URL is correct
- Ensure your network allows outbound HTTPS requests
- Check Azure Function logs for errors

### Validation Errors

The API validates:
- **Name:** Required, max 100 characters
- **Email:** Required, valid email format, max 255 characters
- **Message:** Required, max 5000 characters

If validation fails, the error message will be displayed in the form.

## Security Considerations

1. **Function Key Authentication:** The function requires a valid function key in the `x-functions-key` header
2. **Environment Variables:** Never commit `.env` files to version control
3. **Function Keys:** Store function keys securely in environment variables
4. **API Keys:** The function uses Mailjet API keys stored in Azure (not in the website)
5. **CORS:** Restrict CORS to your specific domain in production
6. **HTTPS:** Always use HTTPS in production
7. **Input Validation:** The API validates all input server-side
8. **Key Rotation:** Regularly rotate function keys for enhanced security
9. **Client-Side Exposure:** Function keys are exposed in client-side code. This is acceptable for this use case, but for highly sensitive applications, consider:
   - Using Azure API Management for additional security layers
   - Implementing App Service Authentication
   - Using Azure AD authentication

## Related Documentation

- [Azure Function Quick Start](../bridged-platforms-contact-us-function/docs/QUICK_START.md)
- [Azure Function Deployment](../bridged-platforms-contact-us-function/docs/DEPLOYMENT.md)
- [Azure Function Integration Guide](../bridged-platforms-contact-us-function/docs/INTEGRATION.md)

