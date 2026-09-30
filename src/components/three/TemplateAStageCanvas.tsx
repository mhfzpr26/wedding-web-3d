'use client'

import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'
import type { CoupleWithDetails } from '@/types'
import TemplateAThematicStage3D from './TemplateAThematicStage3D'

export interface TemplateAStageCanvasProps {
  activeSection: number
  direction?: number
  couple?: CoupleWithDetails
}

export const TemplateAStageCanvas: React.FC<TemplateAStageCanvasProps> = ({
  activeSection,
  direction = 0,
  couple,
}) => {
  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.1, 4.4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <TemplateAThematicStage3D
            activeSection={activeSection}
            direction={direction}
            couple={couple}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default TemplateAStageCanvas
