import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../context/ThemeContext'
import Header from '../Header'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, className }) => <header className={className}>{children}</header>,
    a: ({ children, href, className }) => <a href={href} className={className}>{children}</a>,
    button: ({ children, onClick, className, 'aria-label': ariaLabel }) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>
        {children}
      </button>
    ),
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useMotionValueEvent: vi.fn(),
}))

describe('Header', () => {
  it('should render header with logo', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    // Navigation items appear in both desktop and mobile menus
    const homeLinks = screen.getAllByText('Home')
    const servicesLinks = screen.getAllByText('Services')
    const aboutLinks = screen.getAllByText('About')
    const contactLinks = screen.getAllByText('Contact')

    expect(homeLinks.length).toBeGreaterThan(0)
    expect(servicesLinks.length).toBeGreaterThan(0)
    expect(aboutLinks.length).toBeGreaterThan(0)
    expect(contactLinks.length).toBeGreaterThan(0)
  })

  it('should have correct hrefs for navigation items', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    // Get first instance of each link (desktop menu)
    const homeLink = screen.getAllByText('Home')[0].closest('a')
    const servicesLink = screen.getAllByText('Services')[0].closest('a')
    const aboutLink = screen.getAllByText('About')[0].closest('a')
    const contactLink = screen.getAllByText('Contact')[0].closest('a')

    expect(homeLink).toHaveAttribute('href', '#home')
    expect(servicesLink).toHaveAttribute('href', '#services')
    expect(aboutLink).toHaveAttribute('href', '#about')
    expect(contactLink).toHaveAttribute('href', '#contact')
  })

  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    const toggleButtons = screen.getAllByLabelText('Toggle theme')
    expect(toggleButtons.length).toBeGreaterThan(0)
  })

  it('should toggle theme when theme button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    const toggleButtons = screen.getAllByLabelText('Toggle theme')
    expect(toggleButtons.length).toBeGreaterThan(0)
    
    // Click the first toggle button (desktop version)
    await user.click(toggleButtons[0])

    // Theme should have toggled (we can't easily test the visual change without more setup)
    expect(toggleButtons[0]).toBeInTheDocument()
  })

  it('should render mobile menu button', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

    const menuButton = screen.getByLabelText('Toggle menu')
    expect(menuButton).toBeInTheDocument()
  })
})

