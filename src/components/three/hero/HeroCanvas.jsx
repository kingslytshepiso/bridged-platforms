import React, { Suspense, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { heroTextPalette } from '../../../three/palette'
import HeroParticleBackdrop from './HeroParticleBackdrop'
import HeroTitleGroup from './HeroTitleGroup'

function HeroCanvas({ isDark, theme, reducedMotion, className = '' }) {
  const palette = useMemo(() => heroTextPalette(isDark), [isDark])

  return (
    <div className={`${className} min-h-0`} aria-hidden="true">
      <Canvas
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.035, 8.92], fov: 33 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={isDark ? 0.74 : 0.78} />
        <directionalLight position={[10, 8, 6]} intensity={isDark ? 0.92 : 1.12} color="#ffffff" />
        <directionalLight position={[-8, -4, -2]} intensity={0.44} color={palette.sparkleB} />
        {isDark ? (
          <pointLight position={[4, 2.8, 6.5]} intensity={0.42} distance={26} decay={2} color="#bfdbfe" />
        ) : null}

        <Suspense fallback={null}>
          <HeroParticleBackdrop palette={palette} reducedMotion={reducedMotion} />
          {/* Remount typed meshes on theme change so Troika SDF/outline colors reliably match palette */}
          <group key={theme}>
            <HeroTitleGroup palette={palette} reducedMotion={reducedMotion} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}

HeroCanvas.propTypes = {
  isDark: PropTypes.bool.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  reducedMotion: PropTypes.bool.isRequired,
  className: PropTypes.string,
}

export default HeroCanvas
