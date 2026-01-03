import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../context/ThemeContext'
import Contact from '../Contact'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    button: ({ children, onClick, type, className }) => (
      <button onClick={onClick} type={type} className={className}>
        {children}
      </button>
    ),
  },
  useInView: () => ({ ref: { current: null }, isInView: true }),
}))

describe('Contact', () => {
  it('should render contact form', () => {
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    )

    expect(screen.getByText('Get In Touch')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('should render contact information cards', () => {
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    )

    // Use getAllByText since "Email" appears in both label and heading
    const emailHeadings = screen.getAllByText('Email')
    expect(emailHeadings.length).toBeGreaterThan(0)
    
    expect(screen.getByText('Region')).toBeInTheDocument()
    expect(screen.getByText('Response Time')).toBeInTheDocument()
    expect(screen.getByText('contact@bridgedplatforms.com')).toBeInTheDocument()
    expect(screen.getByText('South Africa')).toBeInTheDocument()
    expect(screen.getByText('Within 24 hours')).toBeInTheDocument()
  })

  it('should allow user to fill out form', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    )

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const messageInput = screen.getByLabelText('Message')

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'Test message')

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(messageInput).toHaveValue('Test message')
  })

  it('should show success message after form submission', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    )

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const messageInput = screen.getByLabelText('Message')
    const submitButton = screen.getByText('Send Message')

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'Test message')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Thank you for your message/i)).toBeInTheDocument()
    })
  })

  it('should require all form fields', () => {
    render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    )

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const messageInput = screen.getByLabelText('Message')

    expect(nameInput).toBeRequired()
    expect(emailInput).toBeRequired()
    expect(messageInput).toBeRequired()
  })
})

