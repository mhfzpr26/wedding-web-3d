'use client'

import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'

interface CanvasWrapperProps {
  children: React.ReactNode
  className?: string
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
  children,
  className = 'w-full h-72',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <directionalLight position={[-2, -1, 2]} intensity={0.4} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}

export default CanvasWrapper
