import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppInsightsProvider, useAppInsights } from '../AppInsightsContext'
import * as applicationInsights from '../../services/applicationInsights'
import * as cookieService from '../../services/cookieService'

// Mock services
const mockGetAppInsights = vi.fn(() => null)
const mockInitializeAppInsights = vi.fn()

vi.mock('../../services/applicationInsights', () => ({
  initializeAppInsights: () => mockInitializeAppInsights(),
  getAppInsights: () => mockGetAppInsights(),
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
    mockGetAppInsights.mockReturnValue(null) // Start with no instance
    mockInitializeAppInsights.mockReturnValue({ initialized: true })
  })

  it('should initialize Application Insights when analytics cookies are allowed', async () => {
    await act(async () => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
      // Wait for useEffect and setTimeout to complete (need longer timeout)
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Wait a bit more to ensure all async operations complete
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(cookieService.isCategoryAllowed).toHaveBeenCalledWith('analytics')
    expect(mockInitializeAppInsights).toHaveBeenCalled()
  })

  it('should not initialize when analytics cookies are not allowed', async () => {
    cookieService.isCategoryAllowed.mockReturnValue(false)

    await act(async () => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(mockInitializeAppInsights).not.toHaveBeenCalled()
  })

  it('should not initialize when instrumentation key is not provided', async () => {
    await act(async () => {
      render(
        <AppInsightsProvider>
          <TestComponent />
        </AppInsightsProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(mockInitializeAppInsights).not.toHaveBeenCalled()
  })

  it('should provide appInsights instance to children', async () => {
    mockGetAppInsights.mockReturnValue({ mock: 'instance' })
    
    await act(async () => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(screen.getByTestId('appInsights')).toHaveTextContent('available')
  })

  it('should handle initialization errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockInitializeAppInsights.mockImplementation(() => {
      throw new Error('Initialization failed')
    })

    expect(() => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
    }).not.toThrow()

    // Wait for useEffect and setTimeout to complete
    await new Promise((resolve) => setTimeout(resolve, 10))

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
    mockGetAppInsights.mockReturnValue(null) // Start with no instance
    mockInitializeAppInsights.mockReturnValue({ initialized: true })
    // After initialization, getAppInsights should return the instance
    mockGetAppInsights.mockReturnValueOnce(null).mockReturnValue({ initialized: true })

    await act(async () => {
      render(
        <AppInsightsProvider instrumentationKey="test-key-123">
          <TestComponent />
        </AppInsightsProvider>
      )
      // Wait for useEffect and setTimeout to complete (setIsInitialized is called in setTimeout)
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Wait a bit more to ensure state update completes
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(screen.getByTestId('initialized')).toHaveTextContent('true')
  })

  it('should log message when analytics cookies not accepted', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    cookieService.isCategoryAllowed.mockReturnValue(false)

    render(
      <AppInsightsProvider instrumentationKey="test-key-123">
        <TestComponent />
      </AppInsightsProvider>
    )

    // Wait for useEffect and setTimeout to complete
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Analytics cookies not accepted')
    )
    consoleSpy.mockRestore()
  })
})
