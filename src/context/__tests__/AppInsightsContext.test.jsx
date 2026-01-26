import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppInsightsProvider, useAppInsights } from '../AppInsightsContext'
import * as applicationInsights from '../../services/applicationInsights'
import * as cookieService from '../../services/cookieService'

// Mock services
vi.mock('../../services/applicationInsights', () => ({
  initializeAppInsights: vi.fn(),
  getAppInsights: vi.fn(() => ({ mock: 'instance' })),
}))

vi.mock('../../services/cookieService', () => ({
  isCategoryAllowed: vi.fn(),
  COOKIE_CATEGORIES: {
    ANALYTICS: 'analytics',
  },
}))

// Test component that uses the context
const TestComponent = () => {
  const { isInitialized, appInsights } = useAppInsights()
  return (
    <div>
      <span data-testid="initialized">{isInitialized.toString()}</span>
      <span data-testid="appInsights">{appInsights ? 'available' : 'null'}</span>
    </div>
  )
}

describe('AppInsightsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cookieService.isCategoryAllowed.mockReturnValue(true)
  })

  it('should initialize Application Insights when analytics cookies are allowed', () => {
    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    expect(cookieService.isCategoryAllowed).toHaveBeenCalledWith('analytics')
    expect(applicationInsights.initializeAppInsights).toHaveBeenCalledWith('test-key-123')
  })

  it('should not initialize when analytics cookies are not allowed', () => {
    cookieService.isCategoryAllowed.mockReturnValue(false)

    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    expect(applicationInsights.initializeAppInsights).not.toHaveBeenCalled()
  })

  it('should not initialize when instrumentation key is not provided', () => {
    render(
      <AppInsightsProvider>
        <TestComponent />
      </AppInsightsProvider>
    )

    expect(applicationInsights.initializeAppInsights).not.toHaveBeenCalled()
  })

  it('should provide appInsights instance to children', () => {
    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    expect(screen.getByTestId('appInsights')).toHaveTextContent('available')
  })

  it('should handle initialization errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    applicationInsights.initializeAppInsights.mockImplementation(() => {
      throw new Error('Initialization failed')
    })

    expect(() => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
    }).not.toThrow()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should throw error when useAppInsights is used outside provider', () => {
    // Suppress React error boundary logging
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // React will catch the error in development mode, so we verify it was logged
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAppInsights must be used within AppInsightsProvider')
    
    consoleErrorSpy.mockRestore()
  })

  it('should set isInitialized to true after successful initialization', async () => {
    applicationInsights.initializeAppInsights.mockReturnValue({ initialized: true })

    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    // Wait for setTimeout to complete (setIsInitialized is called in setTimeout)
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(screen.getByTestId('initialized')).toHaveTextContent('true')
  })

  it('should log message when analytics cookies not accepted', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    cookieService.isCategoryAllowed.mockReturnValue(false)

    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Analytics cookies not accepted')
    )
    consoleSpy.mockRestore()
  })
})
