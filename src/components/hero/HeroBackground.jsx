import React from 'react'
import { motion } from 'framer-motion'

const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden" aria-hidden>
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, -90, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200 dark:bg-secondary-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20"
    />
  </div>
)

export default HeroBackground
