import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import RegionalFocus from './components/RegionalFocus'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <Hero />
        <Services />
        <About />
        <RegionalFocus />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App

