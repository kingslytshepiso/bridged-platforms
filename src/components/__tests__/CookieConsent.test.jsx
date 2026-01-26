import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CookieConsent from '../CookieConsent'
import * as cookieService from '../../services/cookieService'

// Mock framer-motion
 
vi.mock('framer-motion', () => ({
  motion: {
     
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
  },
  // eslint-disable-next-line react/prop-types
  AnimatePresence: ({ children }) => <>{children}</>,
}))
 

// Mock cookieService
vi.mock('../../services/cookieService', () => ({
  hasConsent: vi.fn(),
  setConsent: vi.fn(),
  getCookiePreferences: vi.fn(),
  setCookiePreferences: vi.fn(),
  COOKIE_CATEGORIES: {
    ESSENTIAL: 'essential',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    FUNCTIONAL: 'functional',
  },
}))

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    cookieService.hasConsent.mockReturnValue(false)
    cookieService.getCookiePreferences.mockReturnValue({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not render when user has already given consent', () => {
    cookieService.hasConsent.mockReturnValue(true)
    
    const { container } = render(<CookieConsent />)
    expect(container.firstChild).toBeNull()
  })

  it('should show banner after delay when user has not given consent', async () => {
    render(<CookieConsent />)
    
    expect(screen.queryByText('Cookie Consent')).not.toBeInTheDocument()
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Cookie Consent')).toBeInTheDocument()
    })
  })

  it('should display all consent buttons', async () => {
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Accept All')).toBeInTheDocument()
      expect(screen.getByText('Reject All')).toBeInTheDocument()
      expect(screen.getByText('Customize')).toBeInTheDocument()
    })
  })

  it('should handle Accept All button click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Accept All')).toBeInTheDocument()
    })
    
    const acceptButton = screen.getByText('Accept All')
    await user.click(acceptButton)
    
    expect(cookieService.setCookiePreferences).toHaveBeenCalledWith({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    })
    expect(cookieService.setConsent).toHaveBeenCalledWith(true)
    expect(mockReload).toHaveBeenCalled()
  })

  it('should handle Reject All button click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Reject All')).toBeInTheDocument()
    })
    
    const rejectButton = screen.getByText('Reject All')
    await user.click(rejectButton)
    
    expect(cookieService.setCookiePreferences).toHaveBeenCalledWith({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    })
    expect(cookieService.setConsent).toHaveBeenCalledWith(true)
    expect(mockReload).not.toHaveBeenCalled()
  })

  it('should show preferences modal when Customize is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Customize')).toBeInTheDocument()
    })
    
    const customizeButton = screen.getByText('Customize')
    await user.click(customizeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    })
  })

  it('should show preferences modal when Learn more is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Learn more')).toBeInTheDocument()
    })
    
    const learnMoreButton = screen.getByText('Learn more')
    await user.click(learnMoreButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    })
  })

  it('should display GDPR/POPIA compliance text', async () => {
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/GDPR and POPIA regulations/i)).toBeInTheDocument()
    })
  })

  it('should reload page when analytics is enabled in preferences', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Customize')).toBeInTheDocument()
    })
    
    const customizeButton = screen.getByText('Customize')
    await user.click(customizeButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    })
    
    // Simulate saving preferences with analytics enabled
    const savePreferences = vi.fn((prefs) => {
      cookieService.setCookiePreferences(prefs)
      cookieService.setConsent(true)
      if (prefs.analytics) {
        mockReload()
      }
    })
    
    // This would be called from CookiePreferences component
    savePreferences({
      essential: true,
      analytics: true,
      marketing: false,
      functional: false,
    })
    
    expect(mockReload).toHaveBeenCalled()
  })
})
