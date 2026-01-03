import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'
import Logo from '../Logo'

// Mock the image
vi.mock('/assets/logo.png', () => ({
  default: '/assets/logo.png',
}))

describe('Logo', () => {
  it('should render logo image with correct alt text', () => {
    render(
      <ThemeProvider>
        <Logo />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toBeInTheDocument()
    expect(logo.tagName).toBe('IMG')
  })

  it('should apply default className', () => {
    render(
      <ThemeProvider>
        <Logo />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toHaveClass('h-10')
  })

  it('should apply custom className', () => {
    render(
      <ThemeProvider>
        <Logo className="custom-class" />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toHaveClass('custom-class')
  })

  it('should apply forceLight filter when forceLight is true', () => {
    render(
      <ThemeProvider>
        <Logo forceLight={true} />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    expect(logo).toHaveClass('brightness-0', 'invert')
  })

  it('should use theme-based filter when forceLight is false', () => {
    render(
      <ThemeProvider>
        <Logo forceLight={false} />
      </ThemeProvider>
    )

    const logo = screen.getByAltText('Bridged Platforms')
    // Should have brightness-0 class (light theme default)
    expect(logo.className).toContain('brightness-0')
  })
})

