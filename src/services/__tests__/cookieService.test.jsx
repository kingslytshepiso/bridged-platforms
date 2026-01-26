import { describe, it, expect, beforeEach } from 'vitest'
import {
  COOKIE_CATEGORIES,
  getCookie,
  setCookie,
  deleteCookie,
  hasConsent,
  setConsent,
  getCookiePreferences,
  setCookiePreferences,
  isCategoryAllowed,
  resetCookiePreferences,
  getAllCookies,
} from '../cookieService'

describe('cookieService', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    })
  })

  describe('COOKIE_CATEGORIES', () => {
    it('should export all required cookie categories', () => {
      expect(COOKIE_CATEGORIES.ESSENTIAL).toBe('essential')
      expect(COOKIE_CATEGORIES.ANALYTICS).toBe('analytics')
      expect(COOKIE_CATEGORIES.MARKETING).toBe('marketing')
      expect(COOKIE_CATEGORIES.FUNCTIONAL).toBe('functional')
    })
  })

  describe('getCookie', () => {
    it('should return cookie value when cookie exists', () => {
      document.cookie = 'testCookie=testValue'
      expect(getCookie('testCookie')).toBe('testValue')
    })

    it('should return null when cookie does not exist', () => {
      expect(getCookie('nonExistentCookie')).toBeNull()
    })

    it('should handle cookies with special characters', () => {
      document.cookie = 'testCookie=test%20value%20with%20spaces'
      expect(getCookie('testCookie')).toBe('test%20value%20with%20spaces')
    })
  })

  describe('setCookie', () => {
    it('should set a cookie with default expiration', () => {
      setCookie('testCookie', 'testValue')
      expect(getCookie('testCookie')).toBe('testValue')
    })

    it('should set a cookie with custom expiration days', () => {
      setCookie('testCookie', 'testValue', 30)
      expect(getCookie('testCookie')).toBe('testValue')
    })

    it('should set a cookie with custom path', () => {
      setCookie('testCookie', 'testValue', 365, '/custom')
      expect(getCookie('testCookie')).toBe('testValue')
    })
  })

  describe('deleteCookie', () => {
    it('should delete an existing cookie', () => {
      setCookie('testCookie', 'testValue')
      expect(getCookie('testCookie')).toBe('testValue')
      
      deleteCookie('testCookie')
      expect(getCookie('testCookie')).toBeNull()
    })

    it('should handle deleting non-existent cookie gracefully', () => {
      expect(() => deleteCookie('nonExistentCookie')).not.toThrow()
    })
  })

  describe('hasConsent', () => {
    it('should return false when consent cookie is not set', () => {
      expect(hasConsent()).toBe(false)
    })

    it('should return true when consent cookie is set to true', () => {
      setConsent(true)
      expect(hasConsent()).toBe(true)
    })

    it('should return false when consent cookie is set to false', () => {
      setConsent(false)
      expect(hasConsent()).toBe(false)
    })
  })

  describe('setConsent', () => {
    it('should set consent cookie to true', () => {
      setConsent(true)
      expect(hasConsent()).toBe(true)
    })

    it('should set consent cookie to false', () => {
      setConsent(false)
      expect(hasConsent()).toBe(false)
    })
  })

  describe('getCookiePreferences', () => {
    it('should return default preferences when no preferences are set', () => {
      const preferences = getCookiePreferences()
      expect(preferences[COOKIE_CATEGORIES.ESSENTIAL]).toBe(true)
      expect(preferences[COOKIE_CATEGORIES.ANALYTICS]).toBe(false)
      expect(preferences[COOKIE_CATEGORIES.MARKETING]).toBe(false)
      expect(preferences[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(false)
    })

    it('should return stored preferences when they exist', () => {
      const testPreferences = {
        [COOKIE_CATEGORIES.ESSENTIAL]: true,
        [COOKIE_CATEGORIES.ANALYTICS]: true,
        [COOKIE_CATEGORIES.MARKETING]: false,
        [COOKIE_CATEGORIES.FUNCTIONAL]: true,
      }
      setCookiePreferences(testPreferences)
      
      const preferences = getCookiePreferences()
      expect(preferences[COOKIE_CATEGORIES.ESSENTIAL]).toBe(true)
      expect(preferences[COOKIE_CATEGORIES.ANALYTICS]).toBe(true)
      expect(preferences[COOKIE_CATEGORIES.MARKETING]).toBe(false)
      expect(preferences[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(true)
    })

    it('should return default preferences when stored preferences are invalid JSON', () => {
      document.cookie = 'cookie_preferences=invalid-json'
      const preferences = getCookiePreferences()
      expect(preferences[COOKIE_CATEGORIES.ESSENTIAL]).toBe(true)
      expect(preferences[COOKIE_CATEGORIES.ANALYTICS]).toBe(false)
    })
  })

  describe('setCookiePreferences', () => {
    it('should save preferences and always keep essential enabled', () => {
      const preferences = {
        [COOKIE_CATEGORIES.ESSENTIAL]: false, // Should be overridden
        [COOKIE_CATEGORIES.ANALYTICS]: true,
        [COOKIE_CATEGORIES.MARKETING]: true,
        [COOKIE_CATEGORIES.FUNCTIONAL]: false,
      }
      
      const saved = setCookiePreferences(preferences)
      expect(saved[COOKIE_CATEGORIES.ESSENTIAL]).toBe(true) // Always true
      expect(saved[COOKIE_CATEGORIES.ANALYTICS]).toBe(true)
      expect(saved[COOKIE_CATEGORIES.MARKETING]).toBe(true)
      expect(saved[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(false)
    })

    it('should merge with default preferences', () => {
      const partialPreferences = {
        [COOKIE_CATEGORIES.ANALYTICS]: true,
      }
      
      const saved = setCookiePreferences(partialPreferences)
      expect(saved[COOKIE_CATEGORIES.ESSENTIAL]).toBe(true)
      expect(saved[COOKIE_CATEGORIES.ANALYTICS]).toBe(true)
      expect(saved[COOKIE_CATEGORIES.MARKETING]).toBe(false)
      expect(saved[COOKIE_CATEGORIES.FUNCTIONAL]).toBe(false)
    })
  })

  describe('isCategoryAllowed', () => {
    it('should return true for essential category by default', () => {
      expect(isCategoryAllowed(COOKIE_CATEGORIES.ESSENTIAL)).toBe(true)
    })

    it('should return false for analytics category by default', () => {
      expect(isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS)).toBe(false)
    })

    it('should return true when category is enabled in preferences', () => {
      setCookiePreferences({
        [COOKIE_CATEGORIES.ANALYTICS]: true,
      })
      expect(isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS)).toBe(true)
    })

    it('should return false when category is disabled in preferences', () => {
      setCookiePreferences({
        [COOKIE_CATEGORIES.ANALYTICS]: false,
      })
      expect(isCategoryAllowed(COOKIE_CATEGORIES.ANALYTICS)).toBe(false)
    })
  })

  describe('resetCookiePreferences', () => {
    it('should clear all cookie preferences and consent', () => {
      setConsent(true)
      setCookiePreferences({
        [COOKIE_CATEGORIES.ANALYTICS]: true,
      })
      
      resetCookiePreferences()
      
      expect(hasConsent()).toBe(false)
      const preferences = getCookiePreferences()
      expect(preferences[COOKIE_CATEGORIES.ANALYTICS]).toBe(false)
    })

    it('should preserve theme cookie', () => {
      document.cookie = 'theme=dark'
      setCookie('testCookie', 'testValue')
      
      resetCookiePreferences()
      
      expect(getCookie('theme')).toBe('dark')
      expect(getCookie('testCookie')).toBeNull()
    })
  })

  describe('getAllCookies', () => {
    it('should return empty array when no cookies exist', () => {
      const cookies = getAllCookies()
      expect(cookies).toEqual([])
    })

    it('should return all cookies as objects', () => {
      setCookie('cookie1', 'value1')
      setCookie('cookie2', 'value2')
      
      const cookies = getAllCookies()
      expect(cookies.length).toBeGreaterThanOrEqual(2)
      
      const cookie1 = cookies.find((c) => c.name === 'cookie1')
      const cookie2 = cookies.find((c) => c.name === 'cookie2')
      
      expect(cookie1).toBeDefined()
      expect(cookie1?.value).toBe('value1')
      expect(cookie2).toBeDefined()
      expect(cookie2?.value).toBe('value2')
    })

    it('should handle cookies without values', () => {
      document.cookie = 'cookieWithoutValue='
      const cookies = getAllCookies()
      const cookie = cookies.find((c) => c.name === 'cookieWithoutValue')
      expect(cookie).toBeDefined()
      expect(cookie?.value).toBe('')
    })
  })
})
