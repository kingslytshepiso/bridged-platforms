import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { heroCopy } from './constants'
import { heroItemVariants } from './heroVariants'

function HeroLead({ variants = heroItemVariants }) {
  return (
    <motion.p
      variants={variants}
      className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-7 max-w-[min(100%,42rem)] sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-0 leading-relaxed text-balance"
    >
      {heroCopy.lead}
    </motion.p>
  )
}

HeroLead.propTypes = {
  variants: PropTypes.object,
}

export default HeroLead
