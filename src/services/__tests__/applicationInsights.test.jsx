import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock ApplicationInsights before importing
const mockTrackEvent = vi.fn()
const mockTrackPageView = vi.fn()
const mockTrackException = vi.fn()
const mockSetAuthenticatedUserContext = vi.fn()
const mockClearAuthenticatedUserContext = vi.fn()
const mockLoadAppInsights = vi.fn()

const mockAppInsightsInstance = {
  trackEvent: mockTrackEvent,
  trackPageView: mockTrackPageView,
  trackException: mockTrackException,
  setAuthenticatedUserContext: mockSetAuthenticatedUserContext,
  clearAuthenticatedUserContext: mockClearAuthenticatedUserContext,
  loadAppInsights: mockLoadAppInsights,
  context: {
    user: {},
  },
}

vi.mock('@microsoft/applicationinsights-web', () => ({
  ApplicationInsights: class {
    constructor() {
      return mockAppInsightsInstance
    }
  },
}))

describe('applicationInsights', () => {
  let applicationInsights

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset modules and re-import to get fresh state
    vi.resetModules()
    applicationInsights = await import('../applicationInsights')
    // Always reset the internal state for each test
    applicationInsights.resetAppInsights()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initializeAppInsights', () => {
    it('should return null when no instrumentation key is provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = applicationInsights.initializeAppInsights('')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should initialize Application Insights with valid key', () => {
      const result = applicationInsights.initializeAppInsights('test-key-123')
      
      expect(mockLoadAppInsights).toHaveBeenCalled()
      expect(mockTrackPageView).toHaveBeenCalled()
      expect(result).toBeDefined()
      expect(result).toBe(mockAppInsightsInstance)
    })

    it('should return existing instance if already initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      const firstCall = applicationInsights.getAppInsights()
      
      applicationInsights.initializeAppInsights('test-key-456')
      const secondCall = applicationInsights.getAppInsights()
      
      // Should return the same instance
      expect(firstCall).toBe(secondCall)
    })
  })

  describe('getAppInsights', () => {
    it('should return null when not initialized', () => {
      expect(applicationInsights.getAppInsights()).toBeNull()
    })

    it('should return instance after initialization', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      const instance = applicationInsights.getAppInsights()
      expect(instance).toBeDefined()
    })
  })

  describe('trackEvent', () => {
    it('should not track when Application Insights is not initialized', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      applicationInsights.trackEvent('TestEvent', { test: 'data' })
      expect(mockTrackEvent).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should track event when initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackEvent('TestEvent', { test: 'data' })
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'TestEvent' },
        expect.objectContaining({
          test: 'data',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackPageView', () => {
    it('should not track when Application Insights is not initialized', () => {
      applicationInsights.trackPageView('TestPage')
      expect(mockTrackPageView).not.toHaveBeenCalled()
    })

    it('should track page view when initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackPageView('TestPage', 'https://example.com/test')
      
      expect(mockTrackPageView).toHaveBeenCalledWith({
        name: 'TestPage',
        uri: 'https://example.com/test',
      })
    })

    it('should use window.location.href as default URL', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackPageView('TestPage')
      
      expect(mockTrackPageView).toHaveBeenCalledWith({
        name: 'TestPage',
        uri: window.location.href,
      })
    })
  })

  describe('trackException', () => {
    it('should not track when Application Insights is not initialized', () => {
      const error = new Error('Test error')
      applicationInsights.trackException(error)
      expect(mockTrackException).not.toHaveBeenCalled()
    })

    it('should track exception when initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      const error = new Error('Test error')
      applicationInsights.trackException(error, { custom: 'property' })
      
      expect(mockTrackException).toHaveBeenCalledWith({
        exception: error,
        properties: {
          custom: 'property',
        },
      })
    })
  })

  describe('trackServiceView', () => {
    it('should track service view event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackServiceView('Custom AI Development')
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ServiceViewed' },
        expect.objectContaining({
          serviceName: 'Custom AI Development',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackServiceInteraction', () => {
    it('should track service interaction event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackServiceInteraction('Power Platform Automation')
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ServiceInteraction' },
        expect.objectContaining({
          serviceName: 'Power Platform Automation',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackContactForm', () => {
    it('should track contact form started event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackContactForm('started', { hasName: true })
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ContactForm' },
        expect.objectContaining({
          action: 'started',
          hasName: true,
          timestamp: expect.any(String),
        })
      )
    })

    it('should track contact form success event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackContactForm('success')
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ContactForm' },
        expect.objectContaining({
          action: 'success',
          timestamp: expect.any(String),
        })
      )
    })

    it('should track contact form error event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackContactForm('error', { error: 'Network error' })
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ContactForm' },
        expect.objectContaining({
          action: 'error',
          error: 'Network error',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackThemeToggle', () => {
    it('should track theme toggle event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackThemeToggle('dark')
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ThemeToggle' },
        expect.objectContaining({
          theme: 'dark',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackCTAClick', () => {
    it('should track CTA click event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackCTAClick('Get Started', 'Hero')
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'CTAClick' },
        expect.objectContaining({
          ctaName: 'Get Started',
          location: 'Hero',
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('trackScrollDepth', () => {
    it('should track scroll depth event', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.trackScrollDepth(75)
      
      expect(mockTrackEvent).toHaveBeenCalledWith(
        { name: 'ScrollDepth' },
        expect.objectContaining({
          depth: 75,
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe('setUserContext', () => {
    it('should not set context when Application Insights is not initialized', () => {
      applicationInsights.setUserContext('user-123', { accountId: 'acc-456' })
      expect(mockSetAuthenticatedUserContext).not.toHaveBeenCalled()
    })

    it('should set user context when initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.setUserContext('user-123', { accountId: 'acc-456' })
      
      expect(mockSetAuthenticatedUserContext).toHaveBeenCalledWith('user-123', undefined, true)
      expect(mockAppInsightsInstance.context.user.authenticatedId).toBe('user-123')
      expect(mockAppInsightsInstance.context.user.accountId).toBe('acc-456')
    })

    it('should set user context without account info', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.setUserContext('user-123')
      
      expect(mockSetAuthenticatedUserContext).toHaveBeenCalledWith('user-123', undefined, true)
    })
  })

  describe('clearUserContext', () => {
    it('should not clear context when Application Insights is not initialized', () => {
      applicationInsights.clearUserContext()
      expect(mockClearAuthenticatedUserContext).not.toHaveBeenCalled()
    })

    it('should clear user context when initialized', () => {
      applicationInsights.initializeAppInsights('test-key-123')
      applicationInsights.clearUserContext()
      
      expect(mockClearAuthenticatedUserContext).toHaveBeenCalled()
    })
  })
})
