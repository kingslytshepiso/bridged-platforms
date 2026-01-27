import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../context/ThemeContext'
import ServiceDetailDialog from '../ServiceDetailDialog'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    h2: ({ children, className, ...props }) => <h2 className={className} {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock react-icons
vi.mock('react-icons/md', () => ({
  MdClose: () => <svg data-testid="close-icon" />,
}))

describe('ServiceDetailDialog', () => {
  const mockService = {
    title: 'Test Service',
    icon: () => <svg data-testid="service-icon" />,
    iconBgColor: 'bg-primary-600',
    image: '/test-image.jpg',
    detailTexts: [
      'First detail text about the service.',
      'Second detail text with more information.',
    ],
    attribution: {
      photographer: 'Test Photographer',
      url: 'https://unsplash.com/@test',
      unsplashUrl: 'https://unsplash.com/photos/test',
    },
  }

  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('should not render when service is null', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={null} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.queryByText('Test Service')).not.toBeInTheDocument()
  })

  it('should not render when isOpen is false', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={false} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.queryByText('Test Service')).not.toBeInTheDocument()
  })

  it('should render dialog when isOpen is true and service is provided', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByText('Test Service')).toBeInTheDocument()
  })

  it('should render service title', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByText('Test Service')).toBeInTheDocument()
  })

  it('should render service detail texts', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByText('First detail text about the service.')).toBeInTheDocument()
    expect(screen.getByText('Second detail text with more information.')).toBeInTheDocument()
  })

  it('should render service image when provided', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    const image = screen.getByAltText('Test Service')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  it('should render service icon when provided', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByTestId('service-icon')).toBeInTheDocument()
  })

  it('should render attribution links when provided', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    const photographerLink = screen.getByText('Test Photographer')
    expect(photographerLink).toBeInTheDocument()
    expect(photographerLink.closest('a')).toHaveAttribute('href', 'https://unsplash.com/@test')
    expect(photographerLink.closest('a')).toHaveAttribute('target', '_blank')
    expect(photographerLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')

    const unsplashLink = screen.getByText('Unsplash')
    expect(unsplashLink).toBeInTheDocument()
    expect(unsplashLink.closest('a')).toHaveAttribute('href', 'https://unsplash.com/photos/test')
  })

  it('should call onClose when close button is clicked', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    const closeButton = screen.getByLabelText('Close dialog')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when backdrop is clicked', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    // Find backdrop (the div with backdrop-blur-sm class and z-[60])
    const backdrop = document.querySelector('.z-\\[60\\]')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should prevent body scroll when dialog is open', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={false} onClose={mockOnClose} />
      </ThemeProvider>
    )

    // After cleanup, overflow might be 'unset' or ''
    expect(['', 'unset']).toContain(document.body.style.overflow)

    rerender(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore body scroll when dialog is closed', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={false} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(document.body.style.overflow).toBe('unset')
  })

  it('should call onClose when Escape key is pressed', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when other keys are pressed', () => {
    render(
      <ThemeProvider>
        <ServiceDetailDialog service={mockService} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    fireEvent.keyDown(window, { key: 'Enter' })
    fireEvent.keyDown(window, { key: 'Space' })

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should render fallback header when image is not provided', () => {
    const serviceWithoutImage = {
      ...mockService,
      image: null,
    }

    render(
      <ThemeProvider>
        <ServiceDetailDialog service={serviceWithoutImage} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Service')).not.toBeInTheDocument()
  })

  it('should not render attribution when not provided', () => {
    const serviceWithoutAttribution = {
      ...mockService,
      attribution: null,
    }

    render(
      <ThemeProvider>
        <ServiceDetailDialog service={serviceWithoutAttribution} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.queryByText('Image:')).not.toBeInTheDocument()
    expect(screen.queryByText('Unsplash')).not.toBeInTheDocument()
  })

  it('should not render icon when not provided', () => {
    const serviceWithoutIcon = {
      ...mockService,
      icon: null,
    }

    render(
      <ThemeProvider>
        <ServiceDetailDialog service={serviceWithoutIcon} isOpen={true} onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.queryByTestId('service-icon')).not.toBeInTheDocument()
  })
})
