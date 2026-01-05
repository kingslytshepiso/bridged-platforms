import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'
import Footer from '../Footer'

describe('Footer', () => {
  it('should render footer with logo', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toBeInTheDocument()
  })

  it('should render company description', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    expect(
      screen.getByText(/Empowering businesses with AI-driven automation/i)
    ).toBeInTheDocument()
  })

  it('should render Quick Links section', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should render Focus Areas section', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    expect(screen.getByText('Focus Areas')).toBeInTheDocument()
    expect(screen.getByText('AI & Automation')).toBeInTheDocument()
    expect(screen.getByText('Workflow Implementation')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
    expect(screen.getByText('Cybersecurity')).toBeInTheDocument()
    expect(screen.getByText('African Market')).toBeInTheDocument()
  })

  it('should render copyright notice with current year', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(`© ${currentYear} Bridged Platforms. All rights reserved.`)
    ).toBeInTheDocument()
  })

  it('should have correct hrefs for footer links', () => {
    render(
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    )

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '#home')
    expect(screen.getByText('Services').closest('a')).toHaveAttribute('href', '#services')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '#about')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '#contact')
  })
})



