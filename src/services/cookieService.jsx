/**
 * Cookie Service - Manages cookie preferences and storage
 */

const COOKIE_PREFERENCES_KEY = 'cookie_preferences'
const COOKIE_CONSENT_KEY = 'cookie_consent'

/**
 * Cookie categories enum
 * @typedef {Object} CookieCategories
 * @property {string} ESSENTIAL - Essential cookies category
 * @property {string} ANALYTICS - Analytics cookies category
 * @property {string} MARKETING - Marketing cookies category
 * @property {string} FUNCTIONAL - Functional cookies category
 */

/**
 * Cookie categories
 * @type {CookieCategories}
 */
export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  FUNCTIONAL: 'functional',
}

/**
 * Cookie preferences object
 * @typedef {Object} CookiePreferences
 * @property {boolean} essential - Essential cookies (always true)
 * @property {boolean} analytics - Analytics cookies
 * @property {boolean} marketing - Marketing cookies
 * @property {boolean} functional - Functional cookies
 */

/**
 * Default preferences (all false except essential)
 * @type {CookiePreferences}
 */
const DEFAULT_PREFERENCES = {
  [COOKIE_CATEGORIES.ESSENTIAL]: true, // Always required
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
}

/**
 * Cookie object structure
 * @typedef {Object} Cookie
 * @property {string} name - Cookie name
 * @property {string} value - Cookie value
 */

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string | null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return null
}

/**
 * Set cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} [days=365] - Number of days until expiration
 * @param {string} [path='/'] - Cookie path
 * @returns {void}
 */
export const setCookie = (name, value, days = 365, path = '/') => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path};SameSite=Lax`
}

/**
 * Delete cookie
 * @param {string} name - Cookie name
 * @param {string} [path='/'] - Cookie path
 * @returns {void}
 */
export const deleteCookie = (name, path = '/') => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`
}

/**
 * Check if user has given consent
 * @returns {boolean} True if user has given consent
 */
export const hasConsent = () => {
  return getCookie(COOKIE_CONSENT_KEY) === 'true'
}

/**
 * Set consent status
 * @param {boolean} hasConsented - Whether user has consented
 * @returns {void}
 */
export const setConsent = (hasConsented) => {
  setCookie(COOKIE_CONSENT_KEY, hasConsented.toString(), 365)
}

/**
 * Get cookie preferences
 * @returns {CookiePreferences} Current cookie preferences
 */
export const getCookiePreferences = () => {
  const stored = getCookie(COOKIE_PREFERENCES_KEY)
  if (stored) {
    try {
      return JSON.parse(decodeURIComponent(stored))
    } catch (e) {
      console.error('Error parsing cookie preferences:', e)
      return { ...DEFAULT_PREFERENCES }
    }
  }
  return { ...DEFAULT_PREFERENCES }
}

/**
 * Set cookie preferences
 * @param {Partial<CookiePreferences>} preferences - Preferences to set
 * @returns {CookiePreferences} Saved preferences (with essential always true)
 */
export const setCookiePreferences = (preferences) => {
  const preferencesToSave = {
    ...DEFAULT_PREFERENCES,
    ...preferences,
    [COOKIE_CATEGORIES.ESSENTIAL]: true, // Always keep essential enabled
  }
  setCookie(COOKIE_PREFERENCES_KEY, encodeURIComponent(JSON.stringify(preferencesToSave)), 365)
  return preferencesToSave
}

/**
 * Check if a specific cookie category is allowed
 * @param {string} category - Cookie category to check
 * @returns {boolean} True if category is allowed
 */
export const isCategoryAllowed = (category) => {
  const preferences = getCookiePreferences()
  return preferences[category] === true
}

/**
 * Reset all cookie preferences
 * @returns {void}
 */
export const resetCookiePreferences = () => {
  deleteCookie(COOKIE_PREFERENCES_KEY)
  deleteCookie(COOKIE_CONSENT_KEY)
  // Clear all non-essential cookies
  const cookies = document.cookie.split(';')
  cookies.forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    // Keep essential cookies (theme, etc.)
    if (name !== 'theme' && name !== COOKIE_CONSENT_KEY && name !== COOKIE_PREFERENCES_KEY) {
      deleteCookie(name)
    }
  })
}

/**
 * Get all cookies (for cookie list display)
 * @returns {Cookie[]} Array of cookie objects
 */
export const getAllCookies = () => {
  const cookies = document.cookie.split(';').map((cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim())
    return { name, value: value || '' }
  })
  return cookies.filter((cookie) => cookie.name)
}
