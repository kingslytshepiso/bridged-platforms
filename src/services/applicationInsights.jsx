import { ApplicationInsights } from '@microsoft/applicationinsights-web'

/** @type {ApplicationInsights | null} */
let appInsights = null

/**
 * Initialize Application Insights
 * @param {string} connectionStringOrKey - Azure Application Insights connection string or instrumentation key
 * @returns {ApplicationInsights | null} Initialized Application Insights instance or null
 */
export const initializeAppInsights = (connectionStringOrKey) => {
  if (!connectionStringOrKey) {
    console.warn('Application Insights: No connection string or instrumentation key provided. Tracking disabled.')
    return null
  }

  if (appInsights) {
    return appInsights
  }

  // Determine if it's a connection string or just an instrumentation key
  const isConnectionString = connectionStringOrKey.includes('InstrumentationKey=') && 
                             connectionStringOrKey.includes('IngestionEndpoint=')
  
  const config = {
    // Enable automatic page view tracking
    enableAutoRouteTracking: false, // We'll track manually for SPA
    // Track exceptions automatically
    enableAutoExceptionTracking: true,
    // Track unhandled promise rejections
    enableUnhandledPromiseRejectionTracking: true,
    // Disable correlation headers for CORS (if needed)
    enableCorsCorrelation: false,
    // Enable request tracking
    enableRequestHeaderTracking: true,
    // Enable response header tracking
    enableResponseHeaderTracking: true,
    // Disable telemetry processor for sensitive data (customize as needed)
    disableTelemetry: false,
  }

  // Use connection string if provided (preferred, modern approach)
  if (isConnectionString) {
    config.connectionString = connectionStringOrKey
  } else {
    // Fallback to instrumentation key (legacy support)
    config.instrumentationKey = connectionStringOrKey
  }
  
  appInsights = new ApplicationInsights({
    config,
  })

  appInsights.loadAppInsights()
  appInsights.trackPageView()

  return appInsights
}

/**
 * Get Application Insights instance
 * @returns {ApplicationInsights | null} Current Application Insights instance or null
 */
export const getAppInsights = () => {
  return appInsights
}

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {Record<string, any>} [properties={}] - Additional properties for the event
 * @returns {void}
 */
export const trackEvent = (eventName, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights: Not initialized. Event not tracked:', eventName)
    return
  }

  appInsights.trackEvent(
    { name: eventName },
    {
      timestamp: new Date().toISOString(),
      ...properties,
    }
  )
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {string} [url=window.location.href] - URL of the page
 * @returns {void}
 */
export const trackPageView = (pageName, url = window.location.href) => {
  if (!appInsights) {
    return
  }

  appInsights.trackPageView({
    name: pageName,
    uri: url,
  })
}

/**
 * Track exception
 * @param {Error} error - Error object
 * @param {Record<string, any>} [properties={}] - Additional properties
 * @returns {void}
 */
export const trackException = (error, properties = {}) => {
  if (!appInsights) {
    return
  }

  appInsights.trackException({
    exception: error,
    properties: {
      ...properties,
    },
  })
}

/**
 * Track service view
 * @param {string} serviceName - Name of the service
 * @returns {void}
 */
export const trackServiceView = (serviceName) => {
  trackEvent('ServiceViewed', {
    serviceName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track service hover/interaction
 * @param {string} serviceName - Name of the service
 * @returns {void}
 */
export const trackServiceInteraction = (serviceName) => {
  trackEvent('ServiceInteraction', {
    serviceName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track contact form interaction
 * @param {string} action - Action type (started, submitted, abandoned, error, success)
 * @param {Record<string, any>} [additionalData={}] - Additional data
 * @returns {void}
 */
export const trackContactForm = (action, additionalData = {}) => {
  trackEvent('ContactForm', {
    action,
    ...additionalData,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track theme toggle
 * @param {string} theme - Theme selected (light/dark)
 * @returns {void}
 */
export const trackThemeToggle = (theme) => {
  trackEvent('ThemeToggle', {
    theme,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track CTA click
 * @param {string} ctaName - Name of the CTA
 * @param {string} location - Location of the CTA
 * @returns {void}
 */
export const trackCTAClick = (ctaName, location) => {
  trackEvent('CTAClick', {
    ctaName,
    location,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track scroll depth
 * @param {number} depth - Scroll depth percentage
 * @returns {void}
 */
export const trackScrollDepth = (depth) => {
  trackEvent('ScrollDepth', {
    depth,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Set user context
 * @param {string} userId - User ID (hashed/anonymized)
 * @param {{accountId?: string}} [accountInfo={}] - Account information
 * @returns {void}
 */
export const setUserContext = (userId, accountInfo = {}) => {
  if (!appInsights) {
    return
  }

  appInsights.setAuthenticatedUserContext(userId, undefined, true)
  if (Object.keys(accountInfo).length > 0) {
    appInsights.context.user.authenticatedId = userId
    appInsights.context.user.accountId = accountInfo.accountId
  }
}

/**
 * Clear user context
 * @returns {void}
 */
export const clearUserContext = () => {
  if (!appInsights) {
    return
  }

  appInsights.clearAuthenticatedUserContext()
}
