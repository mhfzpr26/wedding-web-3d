'use client'

import React from 'react'
import CanvasWrapper from './CanvasWrapper'
import TemplateBCover3D, { type TemplateBCover3DProps } from './TemplateBCover3D'

export const TemplateBCanvas: React.FC<TemplateBCover3DProps> = (props) => {
  return (
    <CanvasWrapper className="w-full h-80 sm:h-96 touch-none">
      <TemplateBCover3D {...props} />
    </CanvasWrapper>
  )
}

export default TemplateBCanvas
