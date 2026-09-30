'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { playWaxCrackSound, playPaperRustleSound } from '@/lib/audioFeedback'

export type EnvelopeThemeKey = 'navy' | 'burgundy' | 'olive' | 'saddle'

export interface EnvelopeThemeColors {
  id: EnvelopeThemeKey
  name: string
  body: string
  pocket: string
  flap: string
  innerLiner: string
  goldAccent: string
  waxColor: string
  waxRimColor: string
  waxCenterColor: string
  shadowRgb: string
}

export const ENVELOPE_THEMES: Record<EnvelopeThemeKey, EnvelopeThemeColors> = {
  navy: {
    id: 'navy',
    name: 'Midnight Navy',
    body: '#142036',
    pocket: '#1A2944',
    flap: '#1F3254',
    innerLiner: '#F8F4EA',
    goldAccent: '#D4AF37',
    waxColor: '#78151E',
    waxRimColor: '#8C1B24',
    waxCenterColor: '#9B212B',
    shadowRgb: '18, 30, 50',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Royal Burgundy',
    body: '#3D0D14',
    pocket: '#4D121B',
    flap: '#601824',
    innerLiner: '#FBF5EE',
    goldAccent: '#D4AF37',
    waxColor: '#6B1019',
    waxRimColor: '#7E1520',
    waxCenterColor: '#901C29',
    shadowRgb: '45, 10, 16',
  },
  olive: {
    id: 'olive',
    name: 'Forest Olive',
    body: '#182A20',
    pocket: '#20362A',
    flap: '#294636',
    innerLiner: '#F2F6F3',
    goldAccent: '#D4AF37',
    waxColor: '#7C1720',
    waxRimColor: '#8E1D27',
    waxCenterColor: '#9E242E',
    shadowRgb: '18, 32, 24',
  },
  saddle: {
    id: 'saddle',
    name: 'Rich Saddle',
    body: '#3E2A1C',
    pocket: '#4E3524',
    flap: '#60422D',
    innerLiner: '#F9F4EC',
    goldAccent: '#D4AF37',
    waxColor: '#79161E',
    waxRimColor: '#8C1B25',
    waxCenterColor: '#9C222D',
    shadowRgb: '40, 26, 16',
  },
}

export interface TemplateACover3DProps {
  isSealBroken: boolean
  onBreakSeal: () => void
  onOpenComplete: () => void
  dragY?: number
  setDragY?: (y: number) => void
  isDragging?: boolean
  setIsDragging?: (d: boolean) => void
  forceOpen?: boolean
  themeKey?: EnvelopeThemeKey
}

export const TemplateACover3D: React.FC<TemplateACover3DProps> = ({
  isSealBroken,
  onBreakSeal,
  onOpenComplete,
  dragY = 0,
  setDragY,
  isDragging = false,
  setIsDragging,
  forceOpen = false,
  themeKey = 'navy',
}) => {
  const groupRef = useRef<THREE.Group | null>(null)
  const flapPivotRef = useRef<THREE.Group | null>(null)
  const cardGroupRef = useRef<THREE.Group | null>(null)
  const sealMeshRef = useRef<THREE.Group | null>(null)
  const particlesRef = useRef<THREE.Group | null>(null)

  const [hasFinished, setHasFinished] = useState(false)
  const [isFullySlidingOut, setIsFullySlidingOut] = useState(false)
  const pointerStartRef = useRef<{ y: number; startDragY: number } | null>(null)

  const activeTheme = ENVELOPE_THEMES[themeKey] || ENVELOPE_THEMES.navy

  // Floating ambient golden sparkles around the envelope
  const particlesData = useMemo(() => {
    return Array.from({ length: 26 }).map(() => ({
      x: (Math.random() - 0.5) * 4.6,
      y: (Math.random() - 0.5) * 3.6,
      z: -0.2 + Math.random() * 1.2,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      size: 0.016 + Math.random() * 0.022,
    }))
  }, [])

  // Dynamic soft blurred radial contact shadow texture
  const shadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const rgb = activeTheme.shadowRgb
    const gradient = ctx.createRadialGradient(128, 64, 0, 128, 64, 118)
    gradient.addColorStop(0, `rgba(${rgb}, 0.38)`)
    gradient.addColorStop(0.28, `rgba(${rgb}, 0.22)`)
    gradient.addColorStop(0.65, `rgba(${rgb}, 0.08)`)
    gradient.addColorStop(1, `rgba(${rgb}, 0)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 128)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [activeTheme.shadowRgb])

  // 1. Natural Envelope Back Plate (Rounded Rectangle)
  // Dimensions: 2.68 x 1.80, with realistic soft rounded corners (r = 0.06)
  const backPlateShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.34
    const h = 0.90
    const r = 0.06
    s.moveTo(-w + r, -h)
    s.lineTo(w - r, -h)
    s.quadraticCurveTo(w, -h, w, -h + r)
    s.lineTo(w, h - r)
    s.quadraticCurveTo(w, h, w - r, h)
    s.lineTo(-w + r, h)
    s.quadraticCurveTo(-w, h, -w, h - r)
    s.lineTo(-w, -h + r)
    s.quadraticCurveTo(-w, -h, -w + r, -h)
    s.closePath()
    return s
  }, [])

  // 2. Natural Front Pocket (Kantong Amplop Sejati)
  // Side edges sealed all the way to top corners!
  // Center dips smoothly to y = 0.16, creating the authentic pocket opening.
  const frontPocketShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.34
    const h = 0.90
    const r = 0.06
    s.moveTo(-w + r, -h)
    s.lineTo(w - r, -h)
    s.quadraticCurveTo(w, -h, w, -h + r)
    s.lineTo(w, h - 0.02)
    s.quadraticCurveTo(w, h, w - 0.02, h)
    // Dip gracefully down toward center
    s.bezierCurveTo(w * 0.65, h - 0.28, 0.40, 0.20, 0, 0.16)
    s.bezierCurveTo(-0.40, 0.20, -w * 0.65, h - 0.28, -w + 0.02, h)
    s.quadraticCurveTo(-w, h, -w, h - 0.02)
    s.lineTo(-w, -h + r)
    s.quadraticCurveTo(-w, -h, -w + r, -h)
    s.closePath()
    return s
  }, [])

  // 3. Classic Top Triangular / Euro Flap (Hinged at top edge y = 0.90)
  // Reaches down to world y = 0.90 - 1.04 = -0.14, overlapping pocket dip (y = 0.16) by 0.30 units.
  const topFlapShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.34
    s.moveTo(-w, 0)
    s.lineTo(w, 0)
    // Right slope tapering toward the rounded tip
    s.bezierCurveTo(w * 0.68, -0.42, 0.36, -0.92, 0.08, -1.02)
    // Rounded tip
    s.bezierCurveTo(0.04, -1.06, -0.04, -1.06, -0.08, -1.02)
    // Left slope back to top left corner
    s.bezierCurveTo(-0.36, -0.92, -w * 0.68, -0.42, -w, 0)
    s.closePath()
    return s
  }, [])

  // 4. Slender Metallic Gold Foil Trim along the Flap V-edge
  const flapGoldTrimShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.34
    const t = 0.018 // fine gold trim line
    s.moveTo(-w, 0)
    s.lineTo(-w + t, 0)
    s.bezierCurveTo(-w * 0.68 + t * 0.7, -0.40, -0.34, -0.90, -0.07, -1.00)
    s.bezierCurveTo(-0.03, -1.03, 0.03, -1.03, 0.07, -1.00)
    s.bezierCurveTo(0.34, -0.90, w * 0.68 - t * 0.7, -0.40, w - t, 0)
    s.lineTo(w, 0)
    s.bezierCurveTo(w * 0.68, -0.42, 0.36, -0.92, 0.08, -1.02)
    s.bezierCurveTo(0.04, -1.06, -0.04, -1.06, -0.08, -1.02)
    s.bezierCurveTo(-0.36, -0.92, -w * 0.68, -0.42, -w, 0)
    s.closePath()
    return s
  }, [])

  // 5. Luxury Inner Flap Liner (Revealed ONLY when flap hinges open)
  const innerLinerShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.26
    s.moveTo(-w, -0.02)
    s.lineTo(w, -0.02)
    s.bezierCurveTo(w * 0.66, -0.42, 0.34, -0.90, 0.08, -0.98)
    s.bezierCurveTo(0.04, -1.01, -0.04, -1.01, -0.08, -0.98)
    s.bezierCurveTo(-0.34, -0.90, -w * 0.66, -0.42, -w, -0.02)
    s.closePath()
    return s
  }, [])

  // 6. Organic Melted Wax Puddle Shape (Authentic irregular molten wax contour)
  const waxPuddleShape = useMemo(() => {
    const s = new THREE.Shape()
    const points = 16
    const baseR = 0.28
    const rOffsets = [
      0.020, -0.012, 0.028, 0.008, -0.018, 0.030, 0.006, -0.022,
      0.018, 0.028, -0.010, 0.020, -0.022, 0.012, 0.026, -0.014,
    ]
    const angleStep = (Math.PI * 2) / points
    const coords: [number, number][] = []

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep
      const r = baseR + rOffsets[i]
      coords.push([Math.cos(angle) * r, Math.sin(angle) * r])
    }

    s.moveTo(coords[0][0], coords[0][1])
    for (let i = 0; i < points; i++) {
      const nextIdx = (i + 1) % points
      const midX = (coords[i][0] + coords[nextIdx][0]) / 2
      const midY = (coords[i][1] + coords[nextIdx][1]) / 2
      s.quadraticCurveTo(coords[i][0], coords[i][1], midX, midY)
    }
    s.closePath()
    return s
  }, [])

  // 7. Pristine Cotton Invitation Card inside
  const cardShape = useMemo(() => {
    const s = new THREE.Shape()
    const w = 1.20
    const h = 1.58
    const r = 0.08
    s.moveTo(-w + r, -h / 2)
    s.lineTo(w - r, -h / 2)
    s.quadraticCurveTo(w, -h / 2, w, -h / 2 + r)
    s.lineTo(w, h / 2 - 0.35)
    // Soft elegant arch top
    s.quadraticCurveTo(0, h / 2 + 0.36, -w, h / 2 - 0.35)
    s.lineTo(-w, -h / 2 + r)
    s.quadraticCurveTo(-w, -h / 2, -w + r, -h / 2)
    s.closePath()
    return s
  }, [])

  // Trigger smooth card slide-out
  const triggerSlideOut = () => {
    if (isFullySlidingOut || hasFinished) return
    setIsFullySlidingOut(true)
    if (setIsDragging) setIsDragging(false)
    playPaperRustleSound()
  }

  // One-Tap Unboxing via Wax Seal
  const handleSealTap = (e: ThreeEvent<PointerEvent> | React.MouseEvent) => {
    e.stopPropagation()
    if (isSealBroken || isFullySlidingOut || hasFinished) return

    onBreakSeal()
    playWaxCrackSound()

    setTimeout(() => {
      triggerSlideOut()
    }, 420)
  }

  // Force open handling
  useEffect(() => {
    if (forceOpen && !isFullySlidingOut && !hasFinished) {
      if (!isSealBroken) {
        onBreakSeal()
        playWaxCrackSound()
      }
      setTimeout(() => {
        triggerSlideOut()
      }, 350)
    }
  }, [forceOpen, isSealBroken, onBreakSeal])

  // Drag interaction
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!isSealBroken || isFullySlidingOut || hasFinished) return
    const target = e.target as HTMLElement & { setPointerCapture?: (id: number) => void }
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId)
    }
    if (setIsDragging) setIsDragging(true)
    pointerStartRef.current = {
      y: e.clientY,
      startDragY: dragY,
    }
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !pointerStartRef.current || isFullySlidingOut || hasFinished) return
    const deltaY = pointerStartRef.current.y - e.clientY
    const sensitivity = 0.0055
    const newY = Math.max(0, Math.min(1.5, pointerStartRef.current.startDragY + deltaY * sensitivity))
    if (setDragY) setDragY(newY)

    if (newY > 0.45) {
      triggerSlideOut()
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    if (setIsDragging) setIsDragging(false)
    pointerStartRef.current = null
    if (dragY <= 0.45 && !isFullySlidingOut) {
      if (setDragY) setDragY(0)
    }
  }

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Ambient floating golden dust
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particlesData[i]
        if (p) {
          child.position.y = p.y + Math.sin(time * p.speed + p.offset) * 0.14
        }
      })
    }

    // Natural 3D subtle posture with gentle floating hover
    if (groupRef.current) {
      if (!isSealBroken && !isFullySlidingOut) {
        // Natural 3D perspective tilt: slight tilt back (x: ~0.15) and subtle side angle (y: -0.05)
        groupRef.current.position.y = -0.04 + Math.sin(time * 1.4) * 0.025
        groupRef.current.rotation.y = -0.05 + Math.sin(time * 0.8) * 0.02
        groupRef.current.rotation.x = 0.15 + Math.sin(time * 1.1) * 0.012
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 4.0, delta)
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0.04, 4.0, delta)
      }
    }

    // Wax seal pulse when intact, shrink smoothly when broken
    if (sealMeshRef.current) {
      if (!isSealBroken) {
        const pulse = 1 + Math.sin(time * 3.2) * 0.045
        sealMeshRef.current.scale.set(pulse, pulse, pulse)
      } else {
        sealMeshRef.current.scale.x = THREE.MathUtils.damp(sealMeshRef.current.scale.x, 0.001, 8.0, delta)
        sealMeshRef.current.scale.y = THREE.MathUtils.damp(sealMeshRef.current.scale.y, 0.001, 8.0, delta)
        sealMeshRef.current.scale.z = THREE.MathUtils.damp(sealMeshRef.current.scale.z, 0.001, 8.0, delta)
      }
    }

    // Top Flap Opening Animation (Hinges smoothly backward by ~173 degrees)
    if (flapPivotRef.current) {
      const targetFlapAngle = isSealBroken ? Math.PI * 0.96 : 0
      flapPivotRef.current.rotation.x = THREE.MathUtils.damp(
        flapPivotRef.current.rotation.x,
        targetFlapAngle,
        4.8,
        delta
      )
    }

    // Card inside slide-out animation:
    if (cardGroupRef.current) {
      let targetY = 0

      if (isFullySlidingOut) {
        targetY = 2.45
      } else if (isSealBroken) {
        targetY = 0.28 + dragY
      }

      cardGroupRef.current.position.y = THREE.MathUtils.damp(
        cardGroupRef.current.position.y,
        targetY,
        isFullySlidingOut ? 3.6 : isDragging ? 18.0 : 4.2,
        delta
      )

      if (isFullySlidingOut && !hasFinished && cardGroupRef.current.position.y > 1.7) {
        setHasFinished(true)
        onOpenComplete()
      }
    }
  })

  const isFlapActive = isSealBroken || isFullySlidingOut

  return (
    <group ref={groupRef} position={[0, -0.04, 0]} scale={[1.28, 1.28, 1.28]}>
      {/* 0. Ambient Floating Golden Particles */}
      <group ref={particlesRef}>
        {particlesData.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color={activeTheme.goldAccent} transparent opacity={0.45} />
          </mesh>
        ))}
      </group>

      {/* 0. Silky Smooth Radial Contact Drop Shadow (Zero hard polygonal edges) */}
      {shadowTexture && (
        <mesh position={[0, -0.98, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 0.85]} />
          <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} />
        </mesh>
      )}

      {/* 1. Envelope Back Plate (Thick Premium Linen Cardstock) */}
      <mesh position={[0, 0, 0]}>
        <shapeGeometry args={[backPlateShape]} />
        <meshStandardMaterial
          color={activeTheme.body}
          roughness={0.55}
          metalness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Pristine White & Gold Invitation Card Inside */}
      <group
        ref={cardGroupRef}
        position={[0, -0.06, 0.022]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Card Body - Heavyweight 350gsm Pure Cotton Cardstock */}
        <mesh position={[0, 0, 0]}>
          <shapeGeometry args={[cardShape]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.28} metalness={0.04} />
        </mesh>

        {/* Fine Metallic Gold Foil Border Trim */}
        <mesh position={[0, 0, 0.003]}>
          <shapeGeometry args={[cardShape]} />
          <meshStandardMaterial
            color={activeTheme.goldAccent}
            roughness={0.16}
            metalness={0.94}
          />
        </mesh>

        {/* Inner Card White Mask (retaining crisp gold border frame) */}
        <mesh position={[0, 0, 0.005]} scale={[0.965, 0.97, 1]}>
          <shapeGeometry args={[cardShape]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.28} metalness={0.04} />
        </mesh>

        {/* Gold Foil Couple Initials Crest (reveals majestically as card emerges) */}
        <mesh position={[0, 0.18, 0.006]} scale={[1, 1, 0.02]}>
          <octahedronGeometry args={[0.065, 0]} />
          <meshStandardMaterial
            color={activeTheme.goldAccent}
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>

        {/* Decorative gold laurel ring around monogram */}
        <mesh position={[0, 0.18, 0.006]} scale={[1, 1, 0.02]}>
          <torusGeometry args={[0.12, 0.008, 16, 32]} />
          <meshStandardMaterial
            color={activeTheme.goldAccent}
            metalness={0.95}
            roughness={0.14}
          />
        </mesh>

        {/* Card header accent line */}
        <mesh position={[0, 0.02, 0.006]}>
          <planeGeometry args={[0.55, 0.006]} />
          <meshStandardMaterial
            color={activeTheme.goldAccent}
            metalness={0.90}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* 3. Natural Front Pocket (Kantong Amplop Sejati) */}
      {/* Sits at z = 0.038. Covers the full sides with V-cut dip in center */}
      <mesh position={[0, 0, 0.038]}>
        <shapeGeometry args={[frontPocketShape]} />
        <meshStandardMaterial
          color={activeTheme.pocket}
          roughness={0.52}
          metalness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3b. Front Pocket Rim Shadow Accent (Enhances natural depth along pocket opening) */}
      <mesh position={[0, 0.16, 0.039]}>
        <planeGeometry args={[0.8, 0.006]} />
        <meshBasicMaterial color={activeTheme.body} transparent opacity={0.4} />
      </mesh>

      {/* 4. Top Triangular Euro Flap (Hinged along top edge y = 0.90) */}
      <group ref={flapPivotRef} position={[0, 0.90, 0.044]}>
        {/* Exterior Flap Surface (Deep Luxury Linen) */}
        <mesh position={[0, 0, 0]}>
          <shapeGeometry args={[topFlapShape]} />
          <meshStandardMaterial
            color={activeTheme.flap}
            roughness={0.50}
            metalness={0.07}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Delicate Metallic Gold Foil Border Trim along the Flap V-edge */}
        <mesh position={[0, 0, 0.003]}>
          <shapeGeometry args={[flapGoldTrimShape]} />
          <meshStandardMaterial
            color={activeTheme.goldAccent}
            metalness={0.94}
            roughness={0.14}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Interior Luxe Pearl Champagne Flap Liner (Revealed ONLY when flap hinges open) */}
        {isFlapActive && (
          <group position={[0, 0, -0.002]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0, 0]}>
              <shapeGeometry args={[innerLinerShape]} />
              <meshStandardMaterial
                color={activeTheme.innerLiner}
                metalness={0.25}
                roughness={0.35}
                side={THREE.FrontSide}
              />
            </mesh>

            {/* Gold foil botanical floral damask accent on the inner liner */}
            <mesh position={[0, -0.38, 0.002]}>
              <torusGeometry args={[0.20, 0.009, 16, 32]} />
              <meshStandardMaterial
                color={activeTheme.goldAccent}
                metalness={0.92}
                roughness={0.16}
                side={THREE.FrontSide}
              />
            </mesh>
            <mesh position={[0, -0.38, 0.002]}>
              <octahedronGeometry args={[0.07, 0]} />
              <meshStandardMaterial
                color={activeTheme.goldAccent}
                metalness={0.95}
                roughness={0.12}
                side={THREE.FrontSide}
              />
            </mesh>
          </group>
        )}

        {/* 5. Authentic Organic Wax Seal (Stamped right on the tip of the triangular flap) */}
        <group
          ref={sealMeshRef}
          position={[0, -1.00, 0.026]}
          onClick={handleSealTap}
          onPointerDown={handleSealTap}
        >
          {/* Organic Melted Wax Outer Puddle (Natural wavy edge) */}
          <mesh position={[0, 0, 0]}>
            <shapeGeometry args={[waxPuddleShape]} />
            <meshStandardMaterial
              color={activeTheme.waxColor}
              roughness={0.26}
              metalness={0.18}
            />
          </mesh>

          {/* Raised Wax Rim Ridge */}
          <mesh position={[0, 0, 0.016]}>
            <torusGeometry args={[0.21, 0.028, 16, 32]} />
            <meshStandardMaterial
              color={activeTheme.waxRimColor}
              roughness={0.24}
              metalness={0.20}
            />
          </mesh>

          {/* Recessed Wax Die Coin Face */}
          <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.015, 32]} />
            <meshStandardMaterial
              color={activeTheme.waxCenterColor}
              roughness={0.22}
              metalness={0.22}
            />
          </mesh>

          {/* Embossed Metallic Gold Laurel Wreath Crest */}
          <mesh position={[0, 0, 0.028]}>
            <torusGeometry args={[0.12, 0.009, 16, 32]} />
            <meshStandardMaterial
              color={activeTheme.goldAccent}
              metalness={0.96}
              roughness={0.14}
            />
          </mesh>

          {/* Embossed Center Royal Monogram Sparkle */}
          <mesh position={[0, 0, 0.028]}>
            <octahedronGeometry args={[0.048, 0]} />
            <meshStandardMaterial
              color="#FFF2D6"
              metalness={0.96}
              roughness={0.12}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default TemplateACover3D
