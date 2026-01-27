import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { initializeAppInsights, getAppInsights } from '../services/applicationInsights'
import { isCategoryAllowed, COOKIE_CATEGORIES } from '../services/cookieService'

const AppInsightsContext = createContext()

// Custom event name for cookie preference changes
export const COOKIE_PREFERENCES_CHANGED_EVENT = 'cookiePreferencesChanged'

export const useAppInsights = () => {
  const context = useContext(AppInsightsContext)
  if (!context) {
    throw new Error('useAppInsights must be used within AppInsightsProvider')
  }
  return context
}

export const AppInsightsProvider = ({ children, instrumentationKey }) => {
  const [isInitialized, setIsInitialized] = useState(false)

  // Function to check and initialize Application Insights
  const checkAndInitialize = useCallback(() => {
    // Only initialize if analytics cookies are allowed
    if (isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS) && instrumentationKey) {
      // Check if already initialized to avoid re-initialization
      const existing = getAppInsights()
      if (!existing) {
        try {
          initializeAppInsights(instrumentationKey)
          // Using setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setIsInitialized(true)
          }, 0)
        } catch (error) {
          console.error('Failed to initialize Application Insights:', error)
        }
      } else {
        setIsInitialized(true)
      }
    } else {
      setIsInitialized(false)
      // eslint-disable-next-line no-console
      console.log('Application Insights: Analytics cookies not accepted or no connection string/instrumentation key provided')
    }
  }, [instrumentationKey])

  // Initial check on mount and when instrumentationKey changes
  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously in effect
    const timer = setTimeout(() => {
      checkAndInitialize()
    }, 0)
    return () => clearTimeout(timer)
  }, [checkAndInitialize])

  // Listen for cookie preference changes
  useEffect(() => {
    const handleCookieChange = () => {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        checkAndInitialize()
      }, 0)
    }

    // Listen for custom event when cookie preferences change
    window.addEventListener(COOKIE_PREFERENCES_CHANGED_EVENT, handleCookieChange)

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_CHANGED_EVENT, handleCookieChange)
    }
  }, [checkAndInitialize])

  const value = {
    isInitialized,
    appInsights: getAppInsights(),
  }

  return (
    <AppInsightsContext.Provider value={value}>
      {children}
    </AppInsightsContext.Provider>
  )
}

AppInsightsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  instrumentationKey: PropTypes.string, // Can be connection string or instrumentation key
}
