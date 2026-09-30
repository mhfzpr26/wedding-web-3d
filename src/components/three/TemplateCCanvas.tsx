'use client'

import React from 'react'
import CanvasWrapper from './CanvasWrapper'
import TemplateCCover3D, { type TemplateCCover3DProps } from './TemplateCCover3D'

export const TemplateCCanvas: React.FC<TemplateCCover3DProps> = (props) => {
  return (
    <CanvasWrapper className="w-full h-80 sm:h-96 touch-none">
      <TemplateCCover3D {...props} />
    </CanvasWrapper>
  )
}

export default TemplateCCanvas
