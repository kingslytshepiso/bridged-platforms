import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { initializeAppInsights, getAppInsights } from '../services/applicationInsights'
import { isCategoryAllowed, COOKIE_CATEGORIES } from '../services/cookieService'

const AppInsightsContext = createContext()

export const useAppInsights = () => {
  const context = useContext(AppInsightsContext)
  if (!context) {
    throw new Error('useAppInsights must be used within AppInsightsProvider')
  }
  return context
}

export const AppInsightsProvider = ({ children, instrumentationKey }) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only initialize if analytics cookies are allowed
    if (isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS) && instrumentationKey) {
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
      // eslint-disable-next-line no-console
      console.log('Application Insights: Analytics cookies not accepted or no connection string/instrumentation key provided')
    }
  }, [instrumentationKey])

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
