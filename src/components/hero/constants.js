/**
 * Hero WebGL + Suspense fallback share this single outer `<div>` class list.
 * Adjust vertical slack **here first** (`h-[clamp(...)]`) before touching Three.js internals.
 */
export const HERO_WEBGL_SHELL_CLASS =
  'relative w-full min-w-0 flex-shrink-0 overflow-hidden pointer-events-none select-none h-[clamp(11rem,min(13vw,13.5rem),14.125rem)]'

/** @deprecated Prefer HERO_WEBGL_SHELL_CLASS; kept for readability in imports */
export const HERO_WEBGL_FRAME_CLASS = HERO_WEBGL_SHELL_CLASS

export const heroCopy = {
  title: 'Bridged Platforms',
  tagline: 'Intelligent Systems. Seamless Integration. Secure Automation.',
  lead:
    'Empowering businesses to develop and deploy high-quality software faster through AI-driven automation, custom applications, and secure infrastructure.',
}
