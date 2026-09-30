'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import TemplateACover3D, { type TemplateACover3DProps } from './TemplateACover3D'

export const TemplateACanvas: React.FC<TemplateACover3DProps> = (props) => {
  return (
    <div className="w-full h-64 sm:h-72 touch-none relative select-none">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.55], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Warm Studio Lighting tailored for rich physical paper textures */}
        <ambientLight intensity={1.25} color="#FFFBF5" />
        <directionalLight position={[3.5, 4.5, 4.0]} intensity={2.3} color="#FFF8EF" />
        <directionalLight position={[-3.5, 1.5, 3.0]} intensity={1.15} color="#F5EADE" />
        <directionalLight position={[0, -2.5, 2.0]} intensity={0.6} color="#E8D9C8" />
        <pointLight position={[0, 1.6, 2.8]} intensity={1.5} color="#FFF4E2" distance={7} />

        <Suspense fallback={null}>
          <TemplateACover3D {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default TemplateACanvas
