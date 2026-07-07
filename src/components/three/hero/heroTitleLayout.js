import { heroCopy } from '../../hero/constants'

const TITLE_CHAR_WIDTH_FACTOR = 0.62
const TITLE_CHAR_WIDTH_FACTOR_WRAP = 0.65
const TITLE_FONT_CAP = 1.73
const TITLE_FONT_MIN = 0.9
const TITLE_WIDTH_INSET = 0.82
const TITLE_WIDTH_INSET_WRAP = 0.75
const NARROW_VIEWPORT_THRESHOLD = 11
const FIT_SAFETY_MARGIN = 0.95
const FIT_SAFETY_MARGIN_WRAP = 0.9

/**
 * Derives responsive Troika text layout from R3F viewport width (world units).
 * @param {number} viewportWidth
 */
export function getHeroTitleLayout(viewportWidth) {
  const maxTitleWidth = viewportWidth * TITLE_WIDTH_INSET
  const maxTitleWidthWrap = viewportWidth * TITLE_WIDTH_INSET_WRAP
  const longestWordLength = Math.max(...heroCopy.title.split(' ').map((word) => word.length))

  const fitSingleLine =
    (maxTitleWidth / (heroCopy.title.length * TITLE_CHAR_WIDTH_FACTOR)) * FIT_SAFETY_MARGIN
  const fitWrappedLine =
    (maxTitleWidthWrap / (longestWordLength * TITLE_CHAR_WIDTH_FACTOR_WRAP)) * FIT_SAFETY_MARGIN_WRAP

  const preferWrap = viewportWidth < NARROW_VIEWPORT_THRESHOLD
  const canFitSingleLine = fitSingleLine >= TITLE_FONT_MIN

  let titleFont
  let titleWraps

  if (!preferWrap && canFitSingleLine) {
    titleFont = Math.min(viewportWidth * 0.268, TITLE_FONT_CAP, fitSingleLine)
    titleWraps = false
  } else {
    titleFont = Math.min(viewportWidth * 0.268, TITLE_FONT_CAP, fitWrappedLine)
    titleWraps = true
  }

  const titleGroupY = titleWraps ? 0.28 : 0.17
  const taglineY = titleWraps ? -1.28 : -1.12

  const isNarrow = viewportWidth < NARROW_VIEWPORT_THRESHOLD
  const floatRange = isNarrow ? 0.05 : 0.09
  const taglineFloatRange = isNarrow ? 0.045 : 0.08
  const outlineBlurMul = isNarrow ? 0.75 : 1
  const titleOffsetMul = isNarrow ? 0.55 : 1

  return {
    title: heroCopy.title,
    tagline: heroCopy.tagline,
    titleFont,
    maxTitleWidth: titleWraps ? maxTitleWidthWrap : maxTitleWidth,
    titleGroupY,
    taglineY,
    floatRange,
    taglineFloatRange,
    outlineBlurMul,
    titleOffsetMul,
    subtitleFont: Math.min(viewportWidth * 0.089, 0.605),
    maxSubtitleWidth: viewportWidth * 0.96,
  }
}
