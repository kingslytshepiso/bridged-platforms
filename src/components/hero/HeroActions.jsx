import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { heroItemVariants } from './heroVariants'

function CtaGlowShell({ reducedMotion, glowClassName, children }) {
  return (
    <span className="group relative inline-flex w-full sm:w-auto justify-center">
      <span
        aria-hidden
        className={
          reducedMotion
            ? 'pointer-events-none absolute left-1/2 top-1/2 z-0 h-[200%] w-[155%] -translate-x-1/2 -translate-y-[45%] rounded-[100%] opacity-0'
            : `pointer-events-none absolute left-1/2 top-1/2 z-0 h-[200%] w-[155%] -translate-x-1/2 -translate-y-[45%] rounded-[100%] opacity-0 blur-2xl transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:opacity-0 motion-reduce:group-hover:opacity-0 ${glowClassName}`
        }
      />
      {children}
    </span>
  )
}

CtaGlowShell.propTypes = {
  reducedMotion: PropTypes.bool.isRequired,
  glowClassName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

function HeroActions({ variants = heroItemVariants, reducedMotion }) {
  return (
    <motion.div
      variants={variants}
      className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-lg sm:max-w-none mx-auto px-4 sm:px-0"
    >
      <CtaGlowShell
        reducedMotion={reducedMotion}
        glowClassName="bg-gradient-to-tr from-primary-400/60 via-secondary-400/45 to-primary-500/55 dark:from-primary-400/50 dark:via-secondary-400/40 dark:to-primary-300/50"
      >
        <motion.a
          href="#services"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative z-10 w-full sm:w-auto text-center px-6 py-3 text-sm sm:text-base font-medium bg-primary-600 dark:bg-primary-500 text-white rounded-lg shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          Our Services
        </motion.a>
      </CtaGlowShell>

      <CtaGlowShell
        reducedMotion={reducedMotion}
        glowClassName="bg-gradient-to-tr from-primary-500/45 via-secondary-400/38 to-primary-400/45 dark:from-primary-400/40 dark:via-secondary-400/35 dark:to-primary-300/40"
      >
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative z-10 w-full sm:w-auto text-center px-6 py-3 text-sm sm:text-base font-medium bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
        >
          Get Started
        </motion.a>
      </CtaGlowShell>
    </motion.div>
  )
}

HeroActions.propTypes = {
  variants: PropTypes.object,
  reducedMotion: PropTypes.bool.isRequired,
}

export default HeroActions
