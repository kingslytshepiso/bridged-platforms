# Analytics and Cookie Management Documentation

This document explains the Application Insights integration and cookie consent system implemented in the Bridged Platforms website.

## Overview

The application now includes:
1. **Application Insights** - User tracking and analytics via Azure Application Insights
2. **Cookie Consent System** - GDPR/POPIA compliant cookie management
3. **Custom Event Tracking** - Detailed tracking of user interactions

## Application Insights Integration

### Setup

1. **Create Application Insights Resource** (if not already created):
   - Go to Azure Portal
   - Create a new Application Insights resource
   - Go to Overview > Connection String
   - Click "Show connection string" and copy the full connection string

2. **Configure Environment Variable**:

   **For Local Development:**
   ```bash
   # In your .env file - Use the full connection string (preferred)
   VITE_APPINSIGHTS_KEY=InstrumentationKey=xxx;IngestionEndpoint=https://xxx.in.applicationinsights.azure.com/;LiveEndpoint=https://xxx.livediagnostics.monitor.azure.com/;ApplicationId=xxx
   
   # Or use just the instrumentation key (legacy support)
   VITE_APPINSIGHTS_KEY=your-instrumentation-key-here
   ```

   **For Azure Static Web Apps Deployment:**
   
   The environment variable must be configured in two places:
   
   a. **GitHub Secrets** (for build-time):
      - Go to your GitHub repository
      - Navigate to Settings > Secrets and variables > Actions
      - Add a new secret named `VITE_APPINSIGHTS_KEY`
      - Paste your connection string or instrumentation key
      - The GitHub Actions workflow will use this during the build process
   
   b. **Azure Portal** (optional, for runtime configuration):
      - Go to Azure Portal > Static Web Apps > Your App
      - Navigate to Configuration > Application settings
      - Add a new application setting:
        - Name: `VITE_APPINSIGHTS_KEY`
        - Value: Your connection string or instrumentation key
      - Click "Save"
   
   **Important:** For Vite applications, environment variables are embedded at **build time**, not runtime. The GitHub secret is the primary method. Azure Portal configuration is only needed if you're using Azure Static Web Apps' built-in environment variable system.

3. **Application Insights will only initialize if:**
   - The instrumentation key is provided
   - User has accepted analytics cookies

### What Gets Tracked

#### Automatic Tracking
- **Page Views**: Automatic tracking when sections come into view
- **Exceptions**: Unhandled errors and exceptions
- **Unhandled Promise Rejections**: Failed async operations

#### Custom Events

**Service Interactions:**
- `ServiceViewed` - When a service section is viewed
- `ServiceInteraction` - When a user hovers over a service card

**Contact Form:**
- `ContactForm` with actions:
  - `started` - User begins filling the form
  - `submitted` - Form submission attempt
  - `success` - Successful submission
  - `error` - Submission error

**User Actions:**
- `ThemeToggle` - Dark/light theme changes
- `CTAClick` - Call-to-action button clicks
- `ScrollDepth` - Scroll depth milestones (if implemented)

### Using Application Insights in Components

```javascript
import { trackEvent, trackServiceView, trackContactForm } from '../services/applicationInsights'

// Track a custom event
trackEvent('CustomEventName', {
  property1: 'value1',
  property2: 'value2'
})

// Track service view
trackServiceView('Service Name')

// Track contact form action
trackContactForm('started')
```

### Viewing Analytics

1. Go to Azure Portal
2. Navigate to your Application Insights resource
3. Use the following sections:
   - **Overview**: General metrics and health
   - **Logs**: Query custom events and page views
   - **User Flows**: Visualize user journeys
   - **Funnels**: Analyze conversion paths
   - **Performance**: Monitor page load times

### Sample Queries

**View all service interactions:**
```kusto
customEvents
| where name == "ServiceInteraction"
| project timestamp, customDimensions.serviceName
| order by timestamp desc
```

**Contact form conversion rate:**
```kusto
customEvents
| where name == "ContactForm"
| summarize 
    Started = countif(customDimensions.action == "started"),
    Submitted = countif(customDimensions.action == "submitted"),
    Success = countif(customDimensions.action == "success")
| extend ConversionRate = (Success / Started) * 100
```

**Most popular services:**
```kusto
customEvents
| where name == "ServiceViewed"
| summarize Count = count() by Service = customDimensions.serviceName
| order by Count desc
```

## Cookie Consent System

### Overview

The cookie consent system provides:
- GDPR/POPIA compliance
- Granular cookie category control
- User preference management
- Transparent cookie usage

### Cookie Categories

1. **Essential Cookies** (Always Required)
   - Theme preferences
   - Cookie consent status
   - Cookie preferences

2. **Analytics Cookies**
   - Application Insights tracking
   - User behavior analytics

3. **Functional Cookies**
   - Enhanced functionality
   - Personalization features

4. **Marketing Cookies**
   - Advertising tracking
   - Campaign performance

### User Experience

1. **First Visit**: Cookie consent banner appears after 1 second
2. **Options Available**:
   - Accept All
   - Reject All (only essential cookies)
   - Customize (choose specific categories)

3. **Preference Management**:
   - Users can access preferences via "Learn more" link
   - Preferences can be changed at any time
   - Analytics initialize dynamically without page reload (smooth UX)

### Implementation Details

**Cookie Service** (`src/services/cookieService.js`):
- Manages cookie storage and retrieval
- Handles consent status
- Provides category checking utilities

**Cookie Consent Component** (`src/components/CookieConsent.jsx`):
- Displays consent banner
- Handles user choices
- Integrates with cookie service

**Cookie Preferences Component** (`src/components/CookiePreferences.jsx`):
- Detailed preference management UI
- Category descriptions
- Save/cancel functionality

### Programmatic Usage

```javascript
import { 
  hasConsent, 
  isCategoryAllowed, 
  getCookiePreferences,
  COOKIE_CATEGORIES 
} from '../services/cookieService'

// Check if user has given consent
if (hasConsent()) {
  // User has consented
}

// Check if analytics cookies are allowed
if (isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS)) {
  // Initialize analytics
}

// Get all preferences
const preferences = getCookiePreferences()
```

## Privacy Compliance

### GDPR Compliance
- ✅ Explicit consent before non-essential cookies
- ✅ Granular control over cookie categories
- ✅ Easy withdrawal of consent
- ✅ Clear information about cookie usage

### POPIA Compliance (South Africa)
- ✅ Lawful processing of personal information
- ✅ Consent-based cookie usage
- ✅ User control over data collection
- ✅ Transparent privacy practices

## Best Practices

1. **Respect User Choices**: Always check cookie preferences before tracking
2. **Minimal Data**: Only collect necessary data
3. **Transparency**: Clearly explain what cookies are used for
4. **Easy Access**: Make preference management easily accessible
5. **Regular Review**: Periodically review and update cookie usage

## Troubleshooting

### Application Insights Not Working

1. **Check Instrumentation Key**:
   ```bash
   # Verify .env file has VITE_APPINSIGHTS_KEY set (for local)
   # Or check GitHub Secrets (for Azure Static Web Apps)
   ```

2. **Check Cookie Consent**:
   - Ensure analytics cookies are accepted
   - Check browser console for warnings

3. **Verify Initialization**:
   ```javascript
   import { getAppInsights } from '../services/applicationInsights'
   console.log(getAppInsights()) // Should not be null
   ```

### Azure Static Web Apps Deployment Issues

If Application Insights is not working after deployment to Azure Static Web Apps:

1. **Verify GitHub Secret is Set**:
   - Go to GitHub repository > Settings > Secrets and variables > Actions
   - Ensure `VITE_APPINSIGHTS_KEY` secret exists
   - Verify the secret value matches your connection string or instrumentation key
   - **Important**: Secret name must be exactly `VITE_APPINSIGHTS_KEY` (case-sensitive)

2. **Check GitHub Actions Workflow**:
   - Verify the workflow file (`.github/workflows/azure-static-web-apps-*.yml`) includes:
     ```yaml
     env:
       VITE_APPINSIGHTS_KEY: ${{ secrets.VITE_APPINSIGHTS_KEY }}
     ```
   - Check GitHub Actions logs to ensure the build completed successfully
   - Look for any errors related to environment variables

3. **Verify Build-Time Embedding**:
   - Vite embeds environment variables at **build time**, not runtime
   - The variable must be available during the GitHub Actions build
   - Check the built files in `dist/` to verify the variable was embedded:
     ```bash
     # After build, check if the value appears in the built JS files
     grep -r "VITE_APPINSIGHTS_KEY" dist/
     ```

4. **Clear Browser Cache**:
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Try incognito/private mode

5. **Check Browser Console**:
   - Open browser DevTools > Console
   - Look for messages like:
     - "Application Insights: No connection string or instrumentation key provided"
     - "Application Insights: Analytics cookies not accepted"
   - These messages indicate the issue

6. **Verify Secret Format**:
   - Connection string format: `InstrumentationKey=xxx;IngestionEndpoint=https://xxx.in.applicationinsights.azure.com/;...`
   - Or just instrumentation key: `your-instrumentation-key-here`
   - Ensure no extra spaces or quotes in the GitHub secret value

7. **Redeploy After Secret Addition**:
   - After adding/updating the GitHub secret, trigger a new deployment:
     - Push a new commit to `main` branch, OR
     - Re-run the failed workflow in GitHub Actions

8. **Check Azure Portal Configuration** (Optional):
   - Azure Portal > Static Web Apps > Your App > Configuration
   - Add application setting `VITE_APPINSIGHTS_KEY` if needed
   - Note: This is usually not required for Vite apps as variables are embedded at build time

### Cookie Consent Not Showing

1. **Clear Browser Cookies**: Remove existing consent cookie
2. **Check Component**: Verify CookieConsent is in App.jsx
3. **Check Console**: Look for JavaScript errors

### Events Not Appearing in Application Insights

1. **Wait Time**: Events may take 1-2 minutes to appear
2. **Check Filters**: Ensure date range includes current time
3. **Verify Tracking**: Check browser network tab for telemetry requests
4. **Cookie Status**: Ensure analytics cookies are accepted

## Security Considerations

- Cookie preferences are stored client-side only
- No sensitive data is stored in cookies
- Application Insights data is encrypted in transit
- User IP addresses are anonymized by default in Application Insights
- No personally identifiable information (PII) should be tracked without explicit consent

## Future Enhancements

- [ ] Cookie expiration management
- [ ] Advanced analytics dashboards
- [ ] Real-time analytics monitoring
- [ ] Custom event builder UI
- [ ] Export analytics data functionality

---

**Last Updated:** January 2025
