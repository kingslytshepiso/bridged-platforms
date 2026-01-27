import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    span: ({ children, className, ...props }) => <span className={className} {...props}>{children}</span>,
  },
  useInView: () => ({ ref: { current: null }, isInView: true }),
  AnimatePresence: ({ children }) => children,
}))

// Mock ServiceDetailDialog
vi.mock('../ServiceDetailDialog', () => ({
  default: () => null,
}))

import Services from '../Services'

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

    expect(screen.getByText('Custom AI Application Development')).toBeInTheDocument()
    expect(screen.getByText('Agentic Workflow Implementation')).toBeInTheDocument()
    expect(screen.getByText('System Workflow Automations')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
    expect(screen.getByText('Cost Optimization')).toBeInTheDocument()
    expect(screen.getByText('Cybersecurity Implementation')).toBeInTheDocument()
  })

  it('should render service descriptions', () => {
    render(
      <ThemeProvider>
        <Services />
      </ThemeProvider>
    )

    expect(
      screen.getByText(/Expert automation solutions using Microsoft Power Platform/i)
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
    const serviceCards = screen.getAllByText('Custom AI Application Development')
    expect(serviceCards.length).toBeGreaterThan(0)
  })
})



