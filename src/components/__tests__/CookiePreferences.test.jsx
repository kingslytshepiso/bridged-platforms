import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../context/ThemeContext'
import CookiePreferences from '../CookiePreferences'
import { COOKIE_CATEGORIES } from '../../services/cookieService'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}))

describe('CookiePreferences', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultPreferences = {
    [COOKIE_CATEGORIES.ESSENTIAL]: true,
    [COOKIE_CATEGORIES.ANALYTICS]: false,
    [COOKIE_CATEGORIES.MARKETING]: false,
    [COOKIE_CATEGORIES.FUNCTIONAL]: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithTheme = (component) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('should render cookie preferences modal', () => {
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Cookie Preferences')).toBeInTheDocument()
    expect(screen.getByText(/Manage your cookie preferences/i)).toBeInTheDocument()
  })

  it('should display all cookie categories', () => {
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Essential Cookies')).toBeInTheDocument()
    expect(screen.getByText('Analytics Cookies')).toBeInTheDocument()
    expect(screen.getByText('Functional Cookies')).toBeInTheDocument()
    expect(screen.getByText('Marketing Cookies')).toBeInTheDocument()
  })

  it('should show Required badge for essential cookies', () => {
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('should disable toggle for essential cookies', () => {
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const essentialCheckbox = screen
      .getByText('Essential Cookies')
      .closest('div')
      .querySelector('input[type="checkbox"]')
    
    expect(essentialCheckbox).toBeDisabled()
    expect(essentialCheckbox).toBeChecked()
  })

  it('should allow toggling non-essential cookies', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const analyticsCheckbox = screen
      .getByText('Analytics Cookies')
      .closest('div')
      .querySelector('input[type="checkbox"]')
    
    expect(analyticsCheckbox).not.toBeChecked()
    
    await user.click(analyticsCheckbox)
    expect(analyticsCheckbox).toBeChecked()
  })

  it('should call onSave with updated preferences when Save is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    // Enable analytics by clicking the label
    const analyticsLabel = screen.getByText('Analytics Cookies').closest('label')
    await user.click(analyticsLabel)

    // Click Save button
    const saveButton = screen.getByText('Save Preferences')
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        [COOKIE_CATEGORIES.ESSENTIAL]: true,
        [COOKIE_CATEGORIES.ANALYTICS]: true,
      })
    )
  })

  it('should call onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should call onCancel when clicking outside the modal', async () => {
    const user = userEvent.setup()
    const { container } = renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    // Click on the backdrop (first div with bg-black)
    const backdrop = container.querySelector('.bg-black')
    if (backdrop) {
      await user.click(backdrop)
      expect(mockOnCancel).toHaveBeenCalled()
    }
  })

  it('should not call onCancel when clicking inside the modal', async () => {
    const user = userEvent.setup()
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    // Click inside the modal content
    const modalContent = screen.getByText('Cookie Preferences')
    await user.click(modalContent)

    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('should always keep essential cookies enabled', async () => {
    const user = userEvent.setup()
    const preferencesWithEssentialFalse = {
      ...defaultPreferences,
      [COOKIE_CATEGORIES.ESSENTIAL]: false, // Try to disable
    }

    render(
      <CookiePreferences
        initialPreferences={preferencesWithEssentialFalse}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const saveButton = screen.getByText('Save Preferences')
    await user.click(saveButton)

    // Essential should always be true in the saved preferences
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        [COOKIE_CATEGORIES.ESSENTIAL]: true,
      })
    )
  })

  it('should display category descriptions', () => {
    renderWithTheme(
      <CookiePreferences
        initialPreferences={defaultPreferences}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/These cookies are necessary for the website to function properly/i)).toBeInTheDocument()
    expect(screen.getByText(/help us understand how visitors interact/i)).toBeInTheDocument()
    expect(screen.getByText(/enhanced functionality and personalization/i)).toBeInTheDocument()
    expect(screen.getByText(/deliver relevant advertisements/i)).toBeInTheDocument()
  })
})
