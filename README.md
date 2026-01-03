# Bridged Platforms Website

A modern, responsive single-page application for Bridged Platforms - a consulting organization specializing in AI-driven automation, Microsoft Power Platform, and secure API integrations.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all device sizes
- **Dark/Light Theme**: Complete theme switching with persistent user preference
- **Smooth Animations**: Beautiful animations powered by Framer Motion
- **Modern Stack**: Built with React, Vite, and Tailwind CSS
- **Component-Based**: Easy to maintain and extend with modular components
- **SEO Friendly**: Semantic HTML and proper meta tags
- **Theme-Aware Logo**: Logo automatically adapts to current theme

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library for React

## Color Palette

The website uses a carefully selected color palette:

- **Primary (Blue)**: Trust, technology, security - `#2563eb` to `#172554`
- **Secondary (Teal)**: Innovation, AI, connectivity - `#0d9488` to `#042f2e`
- **Accent (Orange)**: Energy, transformation - `#ea580c` to `#431407`
- **Neutral (Gray)**: Text and backgrounds

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
bridged-platforms/
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header with mobile menu & theme toggle
│   │   ├── Hero.jsx        # Hero section with animated background
│   │   ├── Services.jsx    # Services grid with hover effects
│   │   ├── About.jsx       # About section with vision/mission
│   │   ├── RegionalFocus.jsx # South Africa focus section
│   │   ├── Contact.jsx     # Contact form
│   │   ├── Footer.jsx      # Footer with links
│   │   └── Logo.jsx        # Theme-aware logo component
│   ├── context/
│   │   └── ThemeContext.jsx # Theme context provider
│   ├── App.jsx             # Main app component with ThemeProvider
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles and Tailwind imports
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration with dark mode
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Components

All components are modular and easy to customize:

- **Header**: Sticky navigation with scroll effects and mobile menu
- **Hero**: Animated hero section with gradient background
- **Services**: Grid of service cards with hover animations
- **About**: Vision, mission, and strategic outlook
- **RegionalFocus**: Highlighting South Africa focus
- **Contact**: Contact form with validation
- **Footer**: Footer with links and company info

## Customization

### Theme Switching

The website includes a complete dark/light theme system:
- Theme preference is saved to localStorage
- Automatically detects system preference on first visit
- Theme toggle button in the header (desktop and mobile)
- All components support both themes with smooth transitions

### Logo

The logo component (`src/components/Logo.jsx`) currently uses SVG graphics that match the provided logo designs. To use actual image files:

1. Place logo images in `public/assets/`:
   - `logo-light.svg` or `logo-light.png` (for light theme)
   - `logo-dark.svg` or `logo-dark.png` (for dark theme)

2. Update `src/components/Logo.jsx` to use `<img>` tags instead of SVG:
```jsx
{theme === 'dark' ? (
  <img src="/assets/logo-dark.svg" alt="Bridged Platforms" className={className} />
) : (
  <img src="/assets/logo-light.svg" alt="Bridged Platforms" className={className} />
)}
```

### Colors

Edit `tailwind.config.js` to change the color palette. The theme uses:
- `primary` - Main brand color (blue)
- `secondary` - Secondary brand color (teal)
- `accent` - Accent color (orange)

### Content

Each component is self-contained. Edit the component files to update content.

### Animations

Animations are configured in each component using Framer Motion. Adjust animation parameters in the component files.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2024 Bridged Platforms. All rights reserved.

