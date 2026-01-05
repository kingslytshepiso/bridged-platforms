# Quick Start Guide

Get your Bridged Platforms website up and running with the contact form API integration in minutes!

## 🚀 Local Development (2 minutes)

### Prerequisites

- Node.js 16+ and npm
- Azure Functions Core Tools (for running the API locally)
- Python 3.9+ (for the Azure Function)

### Step 1: Install Dependencies

```bash
# Install website dependencies
npm install
```

### Step 2: Configure API Endpoint

Create a `.env` file in the project root:

```bash
# For local development
VITE_API_URL=http://localhost:7071/api/ContactForm
# Function key is optional for local - Azure Functions Core Tools provides a default
VITE_FUNCTION_KEY=
```

**Note:** For local development, you can leave `VITE_FUNCTION_KEY` empty. Azure Functions Core Tools provides a default master key automatically.

### Step 3: Start Azure Function (Terminal 1)

```bash
# Navigate to the Azure Function directory
cd ../bridged-platforms-contact-us-function

# Install Python dependencies (if not already done)
pip install -r requirements.txt

# Start the function
func start
```

The function should be running at `http://localhost:7071/api/ContactForm`

### Step 4: Start Website (Terminal 2)

```bash
# In the website directory
npm run dev
```

The website should be running at `http://localhost:5173`

### Step 5: Test the Contact Form

1. Open `http://localhost:5173` in your browser
2. Scroll to the contact section
3. Fill out the form:
   - Name: Your name
   - Email: Your email
   - Message: Test message
4. Click "Send Message"
5. You should see:
   - Loading spinner while sending
   - Success message when complete
   - Form fields clear automatically
6. Check the Azure Function terminal for logs
7. Verify email is received at the configured `TO_EMAIL` address

## ☁️ Production Deployment (5 minutes)

### Step 1: Deploy Azure Function

Follow the [Azure Function Deployment Guide](../bridged-platforms-contact-us-function/docs/DEPLOYMENT.md) to deploy your function to Azure.

### Step 2: Get Function URL

1. Go to Azure Portal > Function App
2. Navigate to Functions > ContactForm
3. Click "Get function URL"
4. Copy the full URL

### Step 3: Get Function Key from Azure

1. Go to Azure Portal > Function App
2. Navigate to Functions > ContactForm
3. Click **Function Keys**
4. Copy the **default** key (or create a new one)

### Step 4: Configure Environment Variables

Set the environment variables in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_API_URL
# Enter: https://your-function-app.azurewebsites.net/api/ContactForm

vercel env add VITE_FUNCTION_KEY
# Enter: your-function-key-from-azure-portal
```

**Netlify:**
- Site settings > Environment variables
- Add `VITE_API_URL` = `https://your-function-app.azurewebsites.net/api/ContactForm`
- Add `VITE_FUNCTION_KEY` = `your-function-key-from-azure-portal`

**Other platforms:**
- Set `VITE_API_URL` in your platform's environment variable settings
- Set `VITE_FUNCTION_KEY` in your platform's environment variable settings

### Step 5: Build and Deploy

```bash
# Build the website
npm run build

# Deploy the dist folder to your hosting provider
```

### Step 6: Configure CORS

In Azure Portal:
1. Function App > CORS
2. Add your website domain: `https://yourdomain.com`
3. Remove `*` if present
4. Click Save

## ✅ Verification Checklist

After deployment, verify:

- [ ] Website loads correctly
- [ ] Contact form displays properly
- [ ] Form submission shows loading state
- [ ] Success message appears on successful submission
- [ ] Error message appears on failed submission
- [ ] Email is received at configured address
- [ ] CORS is configured for your domain
- [ ] Environment variable is set correctly

## 🧪 Testing

### Test Form Submission

1. Fill out the contact form
2. Submit and verify:
   - Loading indicator appears
   - Success/error message displays
   - Form behavior is correct

### Test API Directly

```bash
curl -X POST http://localhost:7071/api/ContactForm \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### Test in Browser Console

```javascript
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

## 🐛 Troubleshooting

### Form Not Submitting

**Check:**
- Azure Function is running (`func start`)
- API URL is correct in `.env` file
- Browser console for errors
- Network tab for request details

### CORS Errors

**Solution:**
- For local: CORS is set to `*` by default
- For production: Configure CORS in Azure Portal

### Network Errors

**Solution:**
- Verify Azure Function is accessible
- Check function URL is correct
- Ensure network allows outbound requests

### Environment Variable Not Working

**Solution:**
- Ensure variable starts with `VITE_` prefix
- Restart dev server after changing `.env`
- Check `.env` file is in project root
- Verify no typos in variable name

### 401 Unauthorized Error

**Solution:**
- Verify `VITE_FUNCTION_KEY` is set correctly
- For production: Get the key from Azure Portal > Function > Function Keys
- For local: Check `func start` logs for the master key, or leave empty to use default
- Ensure the key is included in the request headers

## 📚 Next Steps

- Read [API Integration Guide](API_INTEGRATION.md) for detailed information
- Review [Azure Function Documentation](../bridged-platforms-contact-us-function/README.md)
- Customize form styling and messages
- Add additional form validation if needed

## 💡 Tips

- **Keep function running** while developing
- **Check browser console** for debugging
- **Use Network tab** to inspect API requests
- **Test with real emails** to verify delivery
- **Monitor Azure Function logs** for errors

