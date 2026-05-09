import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { HERO_WEBGL_SHELL_CLASS, heroCopy } from './constants'

const HeroCanvas = lazy(() =>
  import('../three/hero').then((m) => ({ default: m.HeroCanvas })),
)

function HeroHeadline({ theme, isDark, reducedMotion }) {
  return (
    <>
      <h1 className="sr-only">{heroCopy.title}</h1>
      <p className="sr-only">{heroCopy.tagline}</p>
      <Suspense
        fallback={
          <div
            aria-hidden
            className={`${HERO_WEBGL_SHELL_CLASS} flex flex-col items-center justify-center gap-1.5 px-3 sm:px-4 leading-none`}
          >
            <p className="text-center whitespace-nowrap font-bold leading-[0.98] bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent text-[clamp(1.875rem,min(13.75vw,4.125rem),8.75rem)] sm:text-[clamp(2.8rem,min(13.75vw,5rem),8.75rem)] md:text-[clamp(3.2rem,min(13.75vw,6rem),8.75rem)] lg:text-[clamp(5.25rem,min(13vw,8rem),8.75rem)] xl:text-[clamp(5.875rem,11.25vw,8.875rem)]">
              {heroCopy.title}
            </p>
            <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-[1.875rem] font-medium text-gray-700 dark:text-gray-200 max-w-4xl leading-snug px-1">
              {heroCopy.tagline}
            </p>
          </div>
        }
      >
        <HeroCanvas
          theme={theme}
          isDark={isDark}
          reducedMotion={reducedMotion}
          className={HERO_WEBGL_SHELL_CLASS}
        />
      </Suspense>
    </>
  )
}

HeroHeadline.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  isDark: PropTypes.bool.isRequired,
  reducedMotion: PropTypes.bool.isRequired,
}

export default HeroHeadline
