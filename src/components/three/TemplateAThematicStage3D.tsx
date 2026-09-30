'use client'

import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export interface TemplateAThematicStage3DProps {
  activeSection: number
  direction?: number
}

// Procedural 3D Asymmetric Torn / Weathered Paper Shape Generator (100% WebGL Three.js - NO SVG)
function createTornParchmentShape(seed: number, w = 0.98, h = 1.38) {
  const shape = new THREE.Shape()

  // Deterministic multi-frequency harmonic noise based on seed for organic torn fibers
  const noise = (t: number) => {
    return (
      Math.sin(t * 13.7 + seed * 7.1) * 0.022 +
      Math.cos(t * 29.3 + seed * 3.3) * 0.014 +
      Math.sin(t * 59.1 + seed * 13.9) * 0.007
    )
  }

  // 1. Bottom edge (from -w to +w) with irregular ragged deckled fibers and asymmetric damages
  const bottomSteps = 30
  shape.moveTo(-w, -h + noise(0))
  for (let i = 1; i <= bottomSteps; i++) {
    const t = i / bottomSteps
    const x = -w + t * (2 * w)
    // Deep torn rip or missing corner chip
    const tear =
      seed === 0 && t > 0.68
        ? -0.14 * Math.sin(((t - 0.68) / 0.32) * Math.PI) // Torn bottom-right corner chip
        : seed === 5 && t > 0.32 && t < 0.68
          ? -0.16 * Math.sin(((t - 0.32) / 0.36) * Math.PI) // Deep jagged rip on Act 05 (sealed by wax seal)
          : seed === 2 && t > 0.45 && t < 0.55
            ? -0.06 * Math.sin(((t - 0.45) / 0.1) * Math.PI) // Perforation notch
            : 0
    const y = -h + noise(t * 5.5) + tear
    shape.lineTo(x, y)
  }

  // 2. Right edge (from -h to +h) with frayed rips & chipped deckle
  const rightSteps = 34
  for (let i = 1; i <= rightSteps; i++) {
    const t = i / rightSteps
    const y = -h + t * (2 * h)
    // Vintage ticket notch or vintage paper rip
    const rip =
      seed === 2 && t > 0.44 && t < 0.56
        ? -0.16 * Math.sin(((t - 0.44) / 0.12) * Math.PI) // Ticket cutout notch
        : seed === 4 && t > 0.72
          ? -0.09 * Math.sin(((t - 0.72) / 0.28) * Math.PI) // Postcard weathered edge
          : seed === 0 && t < 0.2
            ? -0.1 * ((0.2 - t) / 0.2) // Chipped corner matching bottom tear
            : 0
    const x = w + noise(t * 5.5 + 10) + rip
    shape.lineTo(x, y)
  }

  // 3. Top edge (from +w to -w) with uneven deckle & torn corner
  const topSteps = 30
  for (let i = 1; i <= topSteps; i++) {
    const t = i / topSteps
    const x = w - t * (2 * w)
    const tornCorner =
      seed === 1 && t > 0.78
        ? -0.11 * ((t - 0.78) / 0.22) // Chipped top-left corner
        : seed === 3 && t > 0.38 && t < 0.62
          ? 0.05 * Math.sin(((t - 0.38) / 0.24) * Math.PI) // Fold crease flap
          : 0
    const y = h + noise(t * 5.5 + 20) + tornCorner
    shape.lineTo(x, y)
  }

  // 4. Left edge (from +h to -h) with frayed fibers & deckle
  const leftSteps = 34
  for (let i = 1; i <= leftSteps; i++) {
    const t = i / leftSteps
    const y = h - t * (2 * h)
    const tear =
      seed === 1 && t > 0.32 && t < 0.52
        ? 0.12 * Math.sin(((t - 0.32) / 0.2) * Math.PI) // Antique binding tear notch
        : seed === 2 && t > 0.44 && t < 0.56
          ? 0.16 * Math.sin(((t - 0.44) / 0.12) * Math.PI) // Ticket cutout notch left side
          : 0
    const x = -w + noise(t * 5.5 + 30) + tear
    shape.lineTo(x, y)
  }

  shape.closePath()
  return shape
}

// Procedural Canvas Texture for Antique Rag Parchment (100% In-Memory HTML Canvas - NO SVG)
function useParchmentCanvasTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 720
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 1. Base Radiant Ivory Fine Art Paper
    ctx.fillStyle = '#FFFDF8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Soft subtle antique vignette from pure ivory center to warm parchment edges
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.25,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.7
    )
    grad.addColorStop(0, '#FFFFFF')
    grad.addColorStop(0.7, '#FAF6EE')
    grad.addColorStop(1, '#F3ECE0')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 3. Delicate organic paper fibers & subtle speckles
    ctx.fillStyle = 'rgba(180, 160, 130, 0.05)'
    for (let i = 0; i < 600; i++) {
      const px = Math.random() * canvas.width
      const py = Math.random() * canvas.height
      const pw = 1 + Math.random() * 2
      const ph = 0.5 + Math.random() * 0.8
      ctx.fillRect(px, py, pw, ph)
    }

    // 4. Subtle faint horizontal watermark/crease
    ctx.strokeStyle = 'rgba(190, 175, 150, 0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.1, canvas.height * 0.42)
    ctx.lineTo(canvas.width * 0.9, canvas.height * 0.42)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [])
}

// Option 1: Pristine Luxury Cardstock with Gold Gilded Edge (600gsm Cotton Board)
function createGildedCardShape(w = 0.98, h = 1.38, radius = 0.035) {
  const shape = new THREE.Shape()
  const x = -w
  const y = -h
  const width = w * 2
  const height = h * 2

  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)

  return shape
}

// Procedural Rectangular Frame with Hollow Center for Debossed Gold Foil Borders
function createRectFrameShape(w: number, h: number, thickness: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-w, -h)
  shape.lineTo(w, -h)
  shape.lineTo(w, h)
  shape.lineTo(-w, h)
  shape.closePath()

  const hole = new THREE.Path()
  const iw = w - thickness
  const ih = h - thickness
  hole.moveTo(-iw, -ih)
  hole.lineTo(-iw, ih)
  hole.lineTo(iw, ih)
  hole.lineTo(iw, -ih)
  hole.closePath()
  shape.holes.push(hole)

  return shape
}

// Physical 3D Card / Parchment Container with Synchronous Swapping Motion
function TornParchmentContainer3D({
  sectionIndex,
  activeSection,
  direction,
  paperTexture,
  children,
}: {
  sectionIndex: number
  activeSection: number
  direction: number
  paperTexture: THREE.CanvasTexture | null
  children?: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group | null>(null)
  const isGildedCard = sectionIndex === 0
  const cardShape = useMemo(
    () =>
      isGildedCard
        ? createGildedCardShape(0.98, 1.38, 0.035)
        : createTornParchmentShape(sectionIndex, 0.98, 1.38),
    [sectionIndex, isGildedCard]
  )

  // Material setup: For Gilded Cardstock, front/back is cotton paper (mat 0) and edges/bevels are 24K gold leaf (mat 1)
  const gildedMaterials = useMemo(() => {
    if (!isGildedCard) return null
    const faceMat = new THREE.MeshStandardMaterial({
      color: '#FAF6EE',
      roughness: 0.78,
      metalness: 0.02,
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.16,
      map: paperTexture || undefined,
      side: THREE.DoubleSide,
    })
    const goldEdgeMat = new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      metalness: 0.98,
      roughness: 0.12,
      emissive: new THREE.Color('#524010'),
      emissiveIntensity: 0.28,
      side: THREE.DoubleSide,
    })
    return [faceMat, goldEdgeMat]
  }, [isGildedCard, paperTexture])

  const isActive = sectionIndex === activeSection
  const isPreviousActive = useRef(isActive)

  // Motion physics refs
  const currentY = useRef(isActive ? 0 : 3.4)
  const currentRotX = useRef(0)
  const currentRotZ = useRef(0)
  const currentScale = useRef(isActive ? 1 : 0.001)

  // Track activation transition: start from proper side based on direction
  if (isActive !== isPreviousActive.current) {
    isPreviousActive.current = isActive
    if (isActive) {
      // Swapping in: enter from bottom if scrolling down, enter from top if scrolling up
      const enterDir = direction !== 0 ? direction : 1
      currentY.current = -enterDir * 2.8
      currentRotX.current = -enterDir * 0.18
      currentScale.current = 0.92
    }
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    if (isActive) {
      // Spring damp to rest at center
      currentY.current = THREE.MathUtils.damp(currentY.current, 0, 8.5, delta)
      currentRotX.current = THREE.MathUtils.damp(currentRotX.current, 0, 8.0, delta)
      currentRotZ.current = THREE.MathUtils.damp(currentRotZ.current, 0, 7.0, delta)
      currentScale.current = THREE.MathUtils.damp(currentScale.current, 1, 9.0, delta)

      // Gentle organic breathing/hover physics while resting
      const hoverY = Math.sin(t * 1.25 + sectionIndex) * 0.014
      const hoverRotY = Math.sin(t * 0.75 + sectionIndex) * 0.012
      const hoverRotZ = Math.cos(t * 1.0 + sectionIndex) * 0.005

      groupRef.current.position.y = currentY.current + hoverY
      groupRef.current.rotation.x = currentRotX.current
      groupRef.current.rotation.y = hoverRotY
      groupRef.current.rotation.z = currentRotZ.current + hoverRotZ
    } else {
      // Outgoing sheet: flies away in scroll direction with paper flutter
      const isPast = sectionIndex < activeSection
      const exitTargetY = isPast ? 3.4 : -3.4
      const exitTilt = isPast ? 0.32 : -0.32

      currentY.current = THREE.MathUtils.damp(currentY.current, exitTargetY, 7.5, delta)
      currentRotX.current = THREE.MathUtils.damp(currentRotX.current, exitTilt, 6.5, delta)
      currentRotZ.current = THREE.MathUtils.damp(currentRotZ.current, 0, 7.0, delta)
      currentScale.current = THREE.MathUtils.damp(currentScale.current, 0.001, 8.0, delta)

      groupRef.current.position.y = currentY.current
      groupRef.current.rotation.x = currentRotX.current
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 7.0, delta)
      groupRef.current.rotation.z = currentRotZ.current
    }

    const s = Math.max(0.001, currentScale.current)
    groupRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={groupRef} position={[0, isActive ? 0 : 3.4, 0]}>
      {/* 1. Realistic Clean Soft Drop Shadow */}
      <mesh position={[0.024, -0.032, -0.02]}>
        <shapeGeometry args={[cardShape]} />
        <meshBasicMaterial color="#2B1D12" transparent opacity={isGildedCard ? 0.18 : 0.14} />
      </mesh>

      {/* 2. Gilded Gold Leaf Deckle Underlay (For torn paper acts only) */}
      {!isGildedCard && (
        <mesh position={[0, 0, -0.004]} scale={[1.014, 1.01, 1]}>
          <shapeGeometry args={[cardShape]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.96}
            roughness={0.16}
            emissive="#524010"
            emissiveIntensity={0.25}
          />
        </mesh>
      )}

      {/* 3. 3D Card / Parchment Slab Body */}
      {isGildedCard && gildedMaterials ? (
        <mesh position={[0, 0, 0]} material={gildedMaterials}>
          <extrudeGeometry
            args={[
              cardShape,
              {
                depth: 0.034,
                bevelEnabled: true,
                bevelThickness: 0.006,
                bevelSize: 0.005,
                bevelSegments: 3,
              },
            ]}
          />
        </mesh>
      ) : (
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry
            args={[
              cardShape,
              {
                depth: 0.03,
                bevelEnabled: true,
                bevelThickness: 0.004,
                bevelSize: 0.003,
                bevelSegments: 2,
              },
            ]}
          />
          <meshStandardMaterial
            color="#FAF6EE"
            roughness={0.76}
            metalness={0.02}
            emissive="#FFFFFF"
            emissiveIntensity={0.16}
            map={paperTexture || undefined}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 4. Bespoke Physical Accents for this Act */}
      {children}
    </group>
  )
}

// 1. Act 00 Accents: Gold Foil Debossed Hairline Frame & Keystone Royal Seal (Option 1 Gilded Edge Cardstock)
function Act00Accents() {
  const outerFrameShape = useMemo(() => createRectFrameShape(0.91, 1.31, 0.004), [])
  const innerFrameShape = useMemo(() => createRectFrameShape(0.88, 1.28, 0.0025), [])

  const cornerDiamonds = useMemo(
    () => [
      [-0.88, 1.28],
      [0.88, 1.28],
      [-0.88, -1.28],
      [0.88, -1.28],
    ],
    []
  )

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Hairline Gold Foil Border */}
      <mesh position={[0, 0, 0.041]}>
        <shapeGeometry args={[outerFrameShape]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.96}
          roughness={0.14}
          emissive="#524010"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner Hairline Gold Foil Border */}
      <mesh position={[0, 0, 0.041]}>
        <shapeGeometry args={[innerFrameShape]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.96}
          roughness={0.14}
          emissive="#524010"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 4 Corner Ornate Diamond Inlays */}
      {cornerDiamonds.map(([cx, cy], idx) => (
        <mesh key={idx} position={[cx, cy, 0.042]}>
          <octahedronGeometry args={[0.016, 0]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.12} />
        </mesh>
      ))}

      {/* Top Royal Keystone Seal Medallion */}
      <group position={[0, 1.23, 0.048]}>
        <mesh>
          <octahedronGeometry args={[0.052, 0]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.004]}>
          <torusGeometry args={[0.085, 0.01, 16, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>

      {/* Bottom Center Delicate Diamond Accent */}
      <mesh position={[0, -1.23, 0.044]}>
        <octahedronGeometry args={[0.02, 0]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.12} />
      </mesh>
    </group>
  )
}

// 2. Act 01 Accents: Dual Baroque Cameo Medallion Rings (Framing Bride & Groom Photos)
function Act01Accents() {
  return (
    <group position={[0, 0, 0]}>
      {/* Top Ribbon Accent */}
      <mesh position={[0, 1.25, 0.048]}>
        <torusGeometry args={[0.09, 0.015, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.12} />
      </mesh>

      {/* Left Cameo Ring (Groom Photo at y ≈ -0.08) */}
      <group position={[-0.46, -0.08, 0.042]}>
        <mesh scale={[0.48, 0.62, 1]}>
          <torusGeometry args={[0.32, 0.024, 16, 48]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.14} />
        </mesh>
      </group>

      {/* Right Cameo Ring (Bride Photo at y ≈ -0.08) */}
      <group position={[0.46, -0.08, 0.042]}>
        <mesh scale={[0.48, 0.62, 1]}>
          <torusGeometry args={[0.32, 0.024, 16, 48]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.14} />
        </mesh>
      </group>
    </group>
  )
}

// 3. Act 02 Accents: Perforation Tear Stitch Line & Star Emblem
function Act02Accents() {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Gold Star Emblem at Header */}
      <mesh position={[0, 1.24, 0.048]}>
        <octahedronGeometry args={[0.045, 0]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.1} />
      </mesh>
      {/* Perforation Line across paper */}
      <mesh position={[0, 0.02, 0.045]}>
        <planeGeometry args={[1.7, 0.01]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.12} />
      </mesh>
    </group>
  )
}

// 4. Act 03 Accents: Gold Clasp Bar & 3D Peeking Bank Cards at Top Flap
function Act03Accents() {
  return (
    <group position={[0, 0, 0]}>
      {/* Gold Top Flap Clasp Bar */}
      <mesh position={[0, 1.25, 0.048]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.85, 24]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.12} />
      </mesh>

      {/* 3D Bank Card 1 (BCA) - Peeking from Top Pocket */}
      <group position={[-0.2, 1.18, 0.042]} rotation={[0, 0, -0.06]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.008]} />
          <meshStandardMaterial color="#003D79" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[-0.14, 0.04, 0.006]}>
          <boxGeometry args={[0.09, 0.07, 0.003]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>

      {/* 3D Bank Card 2 (Mandiri) - Peeking from Top Pocket */}
      <group position={[0.2, 1.2, 0.038]} rotation={[0, 0, 0.05]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.008]} />
          <meshStandardMaterial color="#1B2A4A" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.14, 0.04, 0.006]}>
          <boxGeometry args={[0.09, 0.07, 0.003]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

// 5. Act 04 Accents: 3D Scalloped Ruby Postage Stamp in Corner
function Act04Accents() {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Postage Stamp in Top Right Corner */}
      <group position={[0.7, 1.15, 0.048]} scale={[0.78, 0.78, 1]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.36, 0.44, 0.01]} />
          <meshStandardMaterial color="#861A24" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.007]}>
          <torusGeometry args={[0.11, 0.01, 16, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.007]}>
          <octahedronGeometry args={[0.032, 0]} />
          <meshStandardMaterial color="#FFF8E7" metalness={0.96} roughness={0.1} />
        </mesh>
      </group>

      {/* 3D Cancellation Waves */}
      <group position={[0.38, 1.15, 0.048]} scale={[0.8, 0.8, 1]}>
        <mesh position={[0, 0.07, 0]}>
          <planeGeometry args={[0.26, 0.008]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.26, 0.008]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.16} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <planeGeometry args={[0.26, 0.008]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.16} />
        </mesh>
      </group>
    </group>
  )
}

// 6. Act 05 Accents: 3D Royal Ruby Wax Seal on Frayed Bottom Edge
function Act05Accents() {
  const waxShape = useMemo(() => {
    const s = new THREE.Shape()
    const points = 16
    const baseR = 0.22
    const rOffsets = [
      0.02, -0.01, 0.03, 0.01, -0.02, 0.03, 0.01, -0.02, 0.02, 0.03, -0.01, 0.02, -0.02, 0.01, 0.03,
      -0.01,
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

  return (
    <group position={[0, -1.06, 0.048]}>
      {/* Ribbon Tails extending down */}
      <mesh position={[-0.09, -0.2, -0.005]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.11, 0.36]} />
        <meshStandardMaterial color="#5E0F17" roughness={0.4} />
      </mesh>
      <mesh position={[0.09, -0.2, -0.005]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.11, 0.36]} />
        <meshStandardMaterial color="#5E0F17" roughness={0.4} />
      </mesh>

      {/* Wax Puddle */}
      <mesh position={[0, 0, 0]}>
        <shapeGeometry args={[waxShape]} />
        <meshStandardMaterial color="#78151E" roughness={0.26} metalness={0.18} />
      </mesh>
      {/* Raised Wax Rim */}
      <mesh position={[0, 0, 0.015]}>
        <torusGeometry args={[0.16, 0.022, 16, 32]} />
        <meshStandardMaterial color="#8C1B24" roughness={0.24} metalness={0.2} />
      </mesh>
      {/* Embossed Gold Laurel Ring */}
      <mesh position={[0, 0, 0.022]}>
        <torusGeometry args={[0.1, 0.009, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.14} />
      </mesh>
      {/* Gold Diamond Monogram */}
      <mesh position={[0, 0, 0.022]}>
        <octahedronGeometry args={[0.038, 0]} />
        <meshStandardMaterial color="#FFF2D6" metalness={0.96} roughness={0.12} />
      </mesh>
    </group>
  )
}

// 7. Golden Bokeh Particles Floating in Background
function GoldenBokehParticles({ isPortrait = false }: { isPortrait?: boolean }) {
  const count = isPortrait ? 30 : 50
  const particlesRef = useRef<THREE.Group | null>(null)

  const particlesData = useMemo(() => {
    const list = []
    const widthRange = isPortrait ? 4.0 : 8.0
    for (let i = 0; i < count; i++) {
      list.push({
        x: (Math.random() - 0.5) * widthRange,
        y: (Math.random() - 0.5) * 6.0,
        z: -1.5 + Math.random() * 4.5,
        speed: 0.15 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.026,
      })
    }
    return list
  }, [count, isPortrait])

  useFrame((state) => {
    if (!particlesRef.current) return
    const t = state.clock.getElapsedTime()
    particlesRef.current.children.forEach((child, i) => {
      const data = particlesData[i]
      if (data) {
        child.position.y = data.y + Math.sin(t * data.speed + data.offset) * 0.2
        child.position.x = data.x + Math.cos(t * data.speed * 0.7 + data.offset) * 0.1
      }
    })
  })

  return (
    <group ref={particlesRef}>
      {particlesData.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

export const TemplateAThematicStage3D: React.FC<TemplateAThematicStage3DProps> = ({
  activeSection,
  direction = 0,
}) => {
  const { size } = useThree()
  const aspect = size.width / Math.max(1, size.height)
  const isPortrait = aspect < 1

  // Perfectly calibrated scale: fits comfortably on both mobile portrait and desktop landscape
  // At camera dist 4.4, FOV 45, visible vertical height is 3.645 units
  // Frustum width is 3.645 * aspect. Paper width is 2 * 0.98 = 1.96 units.
  const frustumWidth = 3.645 * aspect
  const stageScale = isPortrait ? Math.max(0.72, Math.min(0.84, (frustumWidth * 0.88) / 1.96)) : 1.0

  const paperTexture = useParchmentCanvasTexture()

  return (
    <>
      {/* Warm Luxury Studio Lighting */}
      <ambientLight intensity={2.2} color="#FFFDF9" />
      <directionalLight position={[0, 2.5, 5.0]} intensity={2.0} color="#FFFBF5" />
      <directionalLight position={[3.0, 3.5, 4.0]} intensity={1.4} color="#FFF5E6" />
      <directionalLight position={[-3.0, 2.0, 3.5]} intensity={1.1} color="#F2E6D8" />
      <pointLight position={[0, 0.6, 3.5]} intensity={1.4} color="#FFF6E5" distance={8} />

      {/* 3D Scene Elements (NO ARCH / KUBAH - 100% Focused on Physical 3D Weathered Paper) */}
      <group scale={[stageScale, stageScale, stageScale]} position={[0, 0, 0]}>
        <GoldenBokehParticles isPortrait={isPortrait} />

        {/* 6 Asymmetric Torn Parchment Sheets with Synchronized Physical Swapping */}
        <TornParchmentContainer3D
          sectionIndex={0}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act00Accents />
        </TornParchmentContainer3D>

        <TornParchmentContainer3D
          sectionIndex={1}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act01Accents />
        </TornParchmentContainer3D>

        <TornParchmentContainer3D
          sectionIndex={2}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act02Accents />
        </TornParchmentContainer3D>

        <TornParchmentContainer3D
          sectionIndex={3}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act03Accents />
        </TornParchmentContainer3D>

        <TornParchmentContainer3D
          sectionIndex={4}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act04Accents />
        </TornParchmentContainer3D>

        <TornParchmentContainer3D
          sectionIndex={5}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
        >
          <Act05Accents />
        </TornParchmentContainer3D>
      </group>
    </>
  )
}

export default TemplateAThematicStage3D
