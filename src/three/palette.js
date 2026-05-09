/**
 * Hex palette aligned with tailwind.config.js primary / secondary scales.
 */

export const tw = {
  primary400: '#60a5fa',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  secondary400: '#2dd4bf',
  secondary500: '#14b8a6',
  secondary600: '#0d9488',
}

/**
 * @param {boolean} isDark
 * @returns {{
 *   titleMain: string,
 *   titleAccent: string,
 *   titleDepth: string,
 *   titleOutline: string,
 *   titleDepthOutlineOpacity: number,
 *   titleFillOutlineOpacity: number,
 *   titleOutlineBlurScale: number,
 *   titleFloatRotationMul: number,
 *   titleFloatIntensityMul: number,
 *   titleFloatSpeedMul: number,
 *   tagline: string,
 *   sparkleA: string,
 *   sparkleB: string,
 * }}
 */
export function heroTextPalette(isDark) {
  if (isDark) {
    return {
      titleMain: tw.primary400,
      titleAccent: tw.secondary400,
      titleDepth: '#1d4ed8',
      titleOutline: '#94a3b8',
      titleDepthOutlineOpacity: 0.78,
      titleFillOutlineOpacity: 0.68,
      titleOutlineBlurScale: 1.2,
      titleFloatRotationMul: 1.22,
      titleFloatIntensityMul: 1.14,
      titleFloatSpeedMul: 1.06,
      tagline: '#e5e7eb',
      sparkleA: tw.primary400,
      sparkleB: tw.secondary400,
    }
  }

  return {
    titleMain: tw.primary600,
    titleAccent: tw.secondary600,
    titleDepth: '#1e40af',
    titleOutline: '#172554',
    titleDepthOutlineOpacity: 0.9,
    titleFillOutlineOpacity: 0.65,
    titleOutlineBlurScale: 1,
    titleFloatRotationMul: 1,
    titleFloatIntensityMul: 1,
    titleFloatSpeedMul: 1,
    tagline: '#374151',
    sparkleA: tw.primary600,
    sparkleB: tw.secondary600,
  }
}
