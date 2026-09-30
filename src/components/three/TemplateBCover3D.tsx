'use client'

import { ThreeEvent, useFrame } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { playTearSound } from '@/lib/audioFeedback'

export interface TemplateBCover3DProps {
  tearProgress: number
  setTearProgress: (p: number) => void
  isDragging: boolean
  setIsDragging: (d: boolean) => void
  onOpenComplete: () => void
  forceOpen?: boolean
}

export const TemplateBCover3D: React.FC<TemplateBCover3DProps> = ({
  tearProgress,
  setTearProgress,
  isDragging,
  setIsDragging,
  onOpenComplete,
  forceOpen = false,
}) => {
  const groupRef = useRef<THREE.Group | null>(null)
  const topHalfRef = useRef<THREE.Group | null>(null)
  const bottomHalfRef = useRef<THREE.Group | null>(null)
  const tearHeadRef = useRef<THREE.Group | null>(null)
  const remainingStripRef = useRef<THREE.Mesh | null>(null)
  const fiberGroupRef = useRef<THREE.Group | null>(null)

  const [isTearComplete, setIsTearComplete] = useState(false)
  const [hasTriggeredFinished, setHasTriggeredFinished] = useState(false)
  const pointerStartRef = useRef<{ clientX: number; startProgress: number } | null>(null)

  const STRIP_WIDTH = 2.4
  const LEFT_X = -1.2

  const fiberOffsets = React.useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      x: (Math.random() - 0.5) * 0.16,
      y: (Math.random() - 0.5) * 0.22,
      z: 0.02 + Math.random() * 0.04,
      scale: 0.012 + Math.random() * 0.014,
    }))
  }, [])

  // Pointer drag along X axis
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (isTearComplete || hasTriggeredFinished) return
    const target = e.target as HTMLElement & { setPointerCapture?: (id: number) => void }
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId)
    }
    setIsDragging(true)
    pointerStartRef.current = {
      clientX: e.clientX,
      startProgress: tearProgress,
    }
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !pointerStartRef.current || isTearComplete || hasTriggeredFinished) return
    const deltaX = e.clientX - pointerStartRef.current.clientX // dragging right is positive
    const sensitivity = 0.0045
    const newProgress = Math.max(
      0,
      Math.min(1, pointerStartRef.current.startProgress + deltaX * sensitivity)
    )

    if (newProgress > tearProgress) {
      playTearSound(newProgress)
    }
    setTearProgress(newProgress)

    // Threshold > 85% triggers complete tear
    if (newProgress >= 0.85) {
      triggerCompleteTear()
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    pointerStartRef.current = null
    // If released before 85%, snap back to start
    if (tearProgress < 0.85 && !isTearComplete) {
      setTearProgress(0)
    } else if (tearProgress >= 0.85 && !isTearComplete) {
      triggerCompleteTear()
    }
  }

  const triggerCompleteTear = () => {
    if (isTearComplete || hasTriggeredFinished) return
    setIsTearComplete(true)
    setIsDragging(false)
    setTearProgress(1)
    playTearSound(1)
  }

  // Handle force open button
  useEffect(() => {
    if (forceOpen && !isTearComplete && !hasTriggeredFinished) {
      triggerCompleteTear()
    }
  }, [forceOpen])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Gentle hover
    if (groupRef.current && !isTearComplete) {
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.04
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.03
    }

    // Update remaining tear strip geometry position/scale
    if (remainingStripRef.current) {
      const remainingRatio = 1 - tearProgress
      if (remainingRatio > 0.01 && !isTearComplete) {
        remainingStripRef.current.scale.x = Math.max(0.001, remainingRatio)
        remainingStripRef.current.position.x =
          LEFT_X + STRIP_WIDTH * (tearProgress + remainingRatio / 2)
      } else {
        remainingStripRef.current.scale.x = 0.0001
      }
    }

    // Update peeling tear head marker & curled tab
    if (tearHeadRef.current) {
      if (!isTearComplete) {
        const headX = LEFT_X + STRIP_WIDTH * tearProgress
        tearHeadRef.current.position.x = headX
        tearHeadRef.current.position.z = 0.055 + Math.sin(tearProgress * Math.PI) * 0.08
        tearHeadRef.current.rotation.y = -tearProgress * 1.2
      } else {
        tearHeadRef.current.scale.set(0.001, 0.001, 0.001)
      }
    }

    // Micro-fiber paper debris animation during active tearing
    if (fiberGroupRef.current) {
      if (isDragging && tearProgress > 0.03 && !isTearComplete) {
        fiberGroupRef.current.position.y = Math.sin(time * 30) * 0.015
        fiberGroupRef.current.scale.set(1, 1, 1)
      } else {
        fiberGroupRef.current.scale.set(0.001, 0.001, 0.001)
      }
    }

    // Split Spring Animation when torn
    if (isTearComplete) {
      if (topHalfRef.current) {
        topHalfRef.current.position.y = THREE.MathUtils.damp(
          topHalfRef.current.position.y,
          1.85,
          3.6,
          delta
        )
      }
      if (bottomHalfRef.current) {
        bottomHalfRef.current.position.y = THREE.MathUtils.damp(
          bottomHalfRef.current.position.y,
          -1.85,
          3.6,
          delta
        )
      }

      // Check transition finish
      if (!hasTriggeredFinished && topHalfRef.current && topHalfRef.current.position.y > 1.3) {
        setHasTriggeredFinished(true)
        onOpenComplete()
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Core Editorial Invitation Card inside (Revealed on split) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.36, 1.5, 0.02]} />
          <meshStandardMaterial color="#FAFAF8" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Editorial Hairline Border Accent */}
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[2.2, 1.34]} />
          <meshStandardMaterial color="#171717" roughness={0.5} wireframe />
        </mesh>
        {/* Editorial Label Box */}
        <mesh position={[0, 0.1, 0.015]}>
          <planeGeometry args={[1.2, 0.35]} />
          <meshStandardMaterial color="#171717" />
        </mesh>
      </group>

      {/* 2. Top Half Envelope (Charcoal Black) */}
      <group ref={topHalfRef} position={[0, 0.44, 0.03]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.42, 0.76, 0.02]} />
          <meshStandardMaterial color="#171717" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Top Edge Perforation Line */}
        <mesh position={[0, -0.37, 0.012]}>
          <planeGeometry args={[2.38, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* 3. Bottom Half Envelope (Charcoal Black) */}
      <group ref={bottomHalfRef} position={[0, -0.44, 0.03]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.42, 0.76, 0.02]} />
          <meshStandardMaterial color="#171717" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Bottom Edge Perforation Line */}
        <mesh position={[0, 0.37, 0.012]}>
          <planeGeometry args={[2.38, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* 4. Horizontal Perforated Tear Strip Across Center */}
      <mesh
        ref={remainingStripRef}
        position={[0, 0, 0.045]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[STRIP_WIDTH, 0.22]} />
        <meshStandardMaterial color="#EAEAEA" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* 5. Peeling Head Pull Tab */}
      <group
        ref={tearHeadRef}
        position={[LEFT_X, 0, 0.05]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Tab Handle */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.26, 0.28, 0.02]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Paper Fiber Micro-debris Particles at tear point */}
        <group ref={fiberGroupRef} position={[-0.04, 0, 0]}>
          {fiberOffsets.map((f, idx) => (
            <mesh key={idx} position={[f.x, f.y, f.z]}>
              <boxGeometry args={[f.scale * 1.5, f.scale * 0.5, f.scale]} />
              <meshStandardMaterial color="#EAEAEA" roughness={0.9} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

export default TemplateBCover3D
