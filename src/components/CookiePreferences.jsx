import { motion } from 'framer-motion'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { COOKIE_CATEGORIES } from '../services/cookieService'

/**
 * CookiePreferences Component
 * @param {Object} props - Component props
 * @param {Object} props.initialPreferences - Initial cookie preferences
 * @param {Function} props.onSave - Callback when preferences are saved
 * @param {Function} props.onCancel - Callback when preferences dialog is cancelled
 */
const CookiePreferences = ({ initialPreferences, onSave, onCancel }) => {
  const [preferences, setPreferences] = useState({
    ...initialPreferences,
    [COOKIE_CATEGORIES.ESSENTIAL]: true, // Always enabled
  })

  const cookieCategories = [
    {
      id: COOKIE_CATEGORIES.ESSENTIAL,
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function properly. They cannot be disabled.',
      required: true,
    },
    {
      id: COOKIE_CATEGORIES.ANALYTICS,
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false,
    },
    {
      id: COOKIE_CATEGORIES.FUNCTIONAL,
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences.',
      required: false,
    },
    {
      id: COOKIE_CATEGORIES.MARKETING,
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track campaign performance.',
      required: false,
    },
  ]

  const handleToggle = (categoryId) => {
    if (categoryId === COOKIE_CATEGORIES.ESSENTIAL) {
      return // Cannot disable essential cookies
    }
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cookie Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </p>

          <div className="space-y-4 mb-6">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      {category.required && (
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[category.id]}
                      onChange={() => handleToggle(category.id)}
                      disabled={category.required}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

CookiePreferences.propTypes = {
  initialPreferences: PropTypes.shape({
    essential: PropTypes.bool,
    analytics: PropTypes.bool,
    marketing: PropTypes.bool,
    functional: PropTypes.bool,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default CookiePreferences
