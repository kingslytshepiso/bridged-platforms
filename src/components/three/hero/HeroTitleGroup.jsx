import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useThree } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import { HERO_TROIKA_FONT } from '../../../three/fonts'
import { getHeroTitleLayout } from './heroTitleLayout'

function HeroTitleGroup({ palette, reducedMotion }) {
  const { viewport } = useThree()

  const layout = useMemo(() => getHeroTitleLayout(viewport.width), [viewport.width])

  const outlineBlurScale = palette.titleOutlineBlurScale * layout.outlineBlurMul

  const bloom = useMemo(() => {
    const n = 0.12
    return THREE.MathUtils.clamp(n + (reducedMotion ? 0.05 : 0.18), 0.08, 0.88)
  }, [reducedMotion])

  const titleContent = (
    <group position={[0, layout.titleGroupY, 0]}>
      <Text
        position={[0.05 * layout.titleOffsetMul, -0.05 * layout.titleOffsetMul, -0.12]}
        font={HERO_TROIKA_FONT}
        fontSize={layout.titleFont}
        maxWidth={layout.maxTitleWidth}
        letterSpacing={-0.025}
        lineHeight={1.05}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012 * layout.titleFont * outlineBlurScale}
        outlineBlur={reducedMotion ? 0 : 0.035 * layout.titleFont * outlineBlurScale}
        outlineColor={palette.titleOutline}
        outlineOpacity={palette.titleDepthOutlineOpacity}
      >
        {layout.title}
        <meshStandardMaterial color={palette.titleDepth} metalness={0.12} roughness={0.9} toneMapped />
      </Text>

      <Text
        position={[0, 0, 0]}
        font={HERO_TROIKA_FONT}
        fontSize={layout.titleFont}
        maxWidth={layout.maxTitleWidth}
        letterSpacing={-0.025}
        lineHeight={1.05}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.017 * layout.titleFont * outlineBlurScale}
        outlineBlur={reducedMotion ? 0 : 0.012 * layout.titleFont * outlineBlurScale}
        outlineColor={palette.titleAccent}
        outlineOpacity={palette.titleFillOutlineOpacity}
      >
        {layout.title}
        <meshStandardMaterial
          color={palette.titleMain}
          emissive={palette.titleMain}
          emissiveIntensity={bloom}
          metalness={0.52}
          roughness={0.28}
          toneMapped={false}
        />
      </Text>

      <group position={[-0.05 * layout.titleOffsetMul, -0.04 * layout.titleOffsetMul, -0.05]}>
        <Text
          position={[0, 0, 0]}
          font={HERO_TROIKA_FONT}
          fontSize={layout.titleFont}
          maxWidth={layout.maxTitleWidth}
          letterSpacing={-0.025}
          lineHeight={1.05}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          renderOrder={-1}
        >
          {layout.title}
          <meshStandardMaterial
            color={palette.titleAccent}
            emissive={palette.titleAccent}
            emissiveIntensity={reducedMotion ? 0.08 : 0.16}
            metalness={0.25}
            roughness={0.55}
            transparent
            opacity={0.22}
            toneMapped={false}
          />
        </Text>
      </group>
    </group>
  )

  const taglineContent = (
    <Text
      position={[0, layout.taglineY, 0]}
      font={HERO_TROIKA_FONT}
      fontSize={layout.subtitleFont}
      maxWidth={layout.maxSubtitleWidth}
      textAlign="center"
      anchorX="center"
      anchorY="top"
      lineHeight={1.25}
      letterSpacing={0.02}
      outlineWidth={layout.subtitleFont * 0.065}
      outlineColor={palette.titleMain}
      outlineOpacity={0.08}
    >
      {layout.tagline}
      <meshStandardMaterial
        color={palette.tagline}
        emissive={palette.titleAccent}
        emissiveIntensity={reducedMotion ? 0 : 0.04}
        metalness={0.06}
        roughness={0.42}
      />
    </Text>
  )

  const floatSpeed = (reducedMotion ? 0.25 : 1.45) * palette.titleFloatSpeedMul
  const rotInt = (reducedMotion ? 0.02 : 0.18) * palette.titleFloatRotationMul
  const floatInt = (reducedMotion ? 0.06 : 0.29) * palette.titleFloatIntensityMul

  if (reducedMotion) {
    return (
      <group>
        <group>{titleContent}</group>
        {taglineContent}
      </group>
    )
  }

  return (
    <>
      <Float
        rotationIntensity={rotInt}
        floatIntensity={floatInt}
        speed={floatSpeed}
        floatingRange={[-layout.floatRange, layout.floatRange]}
      >
        <group>{titleContent}</group>
      </Float>
      <Float
        rotationIntensity={rotInt * 0.72}
        floatIntensity={floatInt * 0.8}
        speed={floatSpeed * 1.06}
        floatingRange={[-layout.taglineFloatRange, layout.taglineFloatRange]}
      >
        <group>{taglineContent}</group>
      </Float>
    </>
  )
}

HeroTitleGroup.propTypes = {
  palette: PropTypes.shape({
    titleMain: PropTypes.string.isRequired,
    titleAccent: PropTypes.string.isRequired,
    titleDepth: PropTypes.string.isRequired,
    titleOutline: PropTypes.string.isRequired,
    titleDepthOutlineOpacity: PropTypes.number.isRequired,
    titleFillOutlineOpacity: PropTypes.number.isRequired,
    titleOutlineBlurScale: PropTypes.number.isRequired,
    titleFloatRotationMul: PropTypes.number.isRequired,
    titleFloatIntensityMul: PropTypes.number.isRequired,
    titleFloatSpeedMul: PropTypes.number.isRequired,
    tagline: PropTypes.string.isRequired,
    sparkleA: PropTypes.string.isRequired,
    sparkleB: PropTypes.string.isRequired,
  }).isRequired,
  reducedMotion: PropTypes.bool.isRequired,
}

export default HeroTitleGroup
