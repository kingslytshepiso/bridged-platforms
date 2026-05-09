import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import HeroActions from './hero/HeroActions'
import HeroBackground from './hero/HeroBackground'
import HeroHeadline from './hero/HeroHeadline'
import HeroLead from './hero/HeroLead'
import HeroScrollCue from './hero/HeroScrollCue'
import { heroContainerVariants, heroItemVariants } from './hero/heroVariants'

const Hero = () => {
  const { theme } = useTheme()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)

    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const isDark = theme === 'dark'

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <HeroBackground />

      <div className="container-custom relative z-10 w-full min-w-0">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto min-w-0"
        >
          <motion.div variants={heroItemVariants} className="mb-1 md:mb-2 min-w-0">
            <HeroHeadline theme={theme} isDark={isDark} reducedMotion={reducedMotion} />
          </motion.div>

          <HeroLead variants={heroItemVariants} />

          <HeroActions variants={heroItemVariants} reducedMotion={reducedMotion} />
        </motion.div>
      </div>

      <HeroScrollCue />
    </section>
  )
}

export default Hero
