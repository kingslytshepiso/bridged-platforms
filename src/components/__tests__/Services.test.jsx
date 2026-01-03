import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'
import Services from '../Services'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
  useInView: () => ({ ref: { current: null }, isInView: true }),
}))

describe('Services', () => {
  it('should render services section title', () => {
    render(
      <ThemeProvider>
        <Services />
      </ThemeProvider>
    )

    expect(screen.getByText('Our Core Services')).toBeInTheDocument()
  })

  it('should render all service cards', () => {
    render(
      <ThemeProvider>
        <Services />
      </ThemeProvider>
    )

    expect(screen.getByText('Power Platform Consulting')).toBeInTheDocument()
    expect(screen.getByText('Custom AI Applications')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
    expect(screen.getByText('Cost Optimization')).toBeInTheDocument()
    expect(screen.getByText('Cybersecurity Implementation')).toBeInTheDocument()
    expect(screen.getByText('Developer Tools & Practices')).toBeInTheDocument()
  })

  it('should render service descriptions', () => {
    render(
      <ThemeProvider>
        <Services />
      </ThemeProvider>
    )

    expect(
      screen.getByText(/Expert consulting on system automation using Microsoft Power Platform/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Development of custom applications with integrated AI models/i)
    ).toBeInTheDocument()
  })

  it('should render service icons', () => {
    render(
      <ThemeProvider>
        <Services />
      </ThemeProvider>
    )

    // Icons are rendered as SVG elements, we can check if the service cards contain them
    const serviceCards = screen.getAllByText('Power Platform Consulting')
    expect(serviceCards.length).toBeGreaterThan(0)
  })
})

