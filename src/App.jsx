import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AppInsightsProvider } from './context/AppInsightsContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import RegionalFocus from './components/RegionalFocus'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'

function App() {
  // Get Application Insights connection string or instrumentation key from environment
  const instrumentationKey = import.meta.env.VITE_APPINSIGHTS_KEY || ''

  return (
    <ThemeProvider>
      <AppInsightsProvider instrumentationKey={instrumentationKey}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <Hero />
          <Services />
          <About />
          <RegionalFocus />
          <Contact />
          <Footer />
          <CookieConsent />
        </div>
      </AppInsightsProvider>
    </ThemeProvider>
  )
}

export default App

