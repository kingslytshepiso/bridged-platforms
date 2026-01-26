import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { hasConsent, setConsent, getCookiePreferences, setCookiePreferences, COOKIE_CATEGORIES } from '../services/cookieService'
import CookiePreferences from './CookiePreferences'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState(getCookiePreferences())

  useEffect(() => {
    // Show banner if user hasn't given consent
    if (!hasConsent()) {
      // Small delay for better UX
      setTimeout(() => {
        setShowBanner(true)
      }, 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      [COOKIE_CATEGORIES.ESSENTIAL]: true,
      [COOKIE_CATEGORIES.ANALYTICS]: true,
      [COOKIE_CATEGORIES.MARKETING]: true,
      [COOKIE_CATEGORIES.FUNCTIONAL]: true,
    }
    setCookiePreferences(allAccepted)
    setConsent(true)
    setShowBanner(false)
    // Reload page to apply analytics if enabled
    if (allAccepted[COOKIE_CATEGORIES.ANALYTICS]) {
      window.location.reload()
    }
  }

  const handleRejectAll = () => {
    const onlyEssential = {
      [COOKIE_CATEGORIES.ESSENTIAL]: true,
      [COOKIE_CATEGORIES.ANALYTICS]: false,
      [COOKIE_CATEGORIES.MARKETING]: false,
      [COOKIE_CATEGORIES.FUNCTIONAL]: false,
    }
    setCookiePreferences(onlyEssential)
    setConsent(true)
    setShowBanner(false)
  }

  const handleCustomize = () => {
    setShowPreferences(true)
  }

  const handlePreferencesSave = (newPreferences) => {
    setCookiePreferences(newPreferences)
    setPreferences(newPreferences)
    setConsent(true)
    setShowPreferences(false)
    setShowBanner(false)
    // Reload page to apply analytics if enabled
    if (newPreferences[COOKIE_CATEGORIES.ANALYTICS]) {
      window.location.reload()
    }
  }

  const handlePreferencesCancel = () => {
    setShowPreferences(false)
  }

  if (!showBanner && !showPreferences) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="container-custom py-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Cookie Consent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can also customize your preferences 
                    or reject non-essential cookies.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This website complies with GDPR and POPIA regulations. 
                    <button
                      onClick={handleCustomize}
                      className="ml-1 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Learn more
                    </button>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleCustomize}
                    className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPreferences && (
        <CookiePreferences
          initialPreferences={preferences}
          onSave={handlePreferencesSave}
          onCancel={handlePreferencesCancel}
        />
      )}
    </>
  )
}

export default CookieConsent
