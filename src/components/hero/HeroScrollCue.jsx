import React from 'react'
import { motion } from 'framer-motion'

const HeroScrollCue = () => (
  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    aria-hidden
  >
    <svg
      className="w-6 h-6 text-gray-400 dark:text-gray-500"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </motion.div>
)

export default HeroScrollCue
