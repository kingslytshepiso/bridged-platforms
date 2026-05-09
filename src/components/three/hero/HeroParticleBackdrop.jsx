import React from 'react'
import PropTypes from 'prop-types'
import { Sparkles } from '@react-three/drei'

function HeroParticleBackdrop({ palette, reducedMotion }) {
  const count = reducedMotion ? 36 : 80
  const speed = reducedMotion ? 0.12 : 0.52
  const size = reducedMotion ? 2.8 : 3.4

  return (
    <group position={[0, 0.12, -3.85]}>
      <Sparkles
        count={count}
        scale={[15, 5.8, 3.6]}
        size={size}
        speed={speed}
        opacity={0.42}
        color={palette.sparkleA}
      />
      <Sparkles
        count={Math.round(count * 0.55)}
        scale={[12.5, 5.2, 2.9]}
        size={size * 0.78}
        speed={speed * 0.92}
        opacity={0.28}
        color={palette.sparkleB}
      />
      <Sparkles
        count={reducedMotion ? 18 : 24}
        scale={[18, 3.8, 4.8]}
        size={3.9}
        speed={0.35}
        opacity={0.18}
        color={palette.sparkleA}
      />
    </group>
  )
}

HeroParticleBackdrop.propTypes = {
  palette: PropTypes.shape({
    sparkleA: PropTypes.string.isRequired,
    sparkleB: PropTypes.string.isRequired,
  }).isRequired,
  reducedMotion: PropTypes.bool.isRequired,
}

export default HeroParticleBackdrop
