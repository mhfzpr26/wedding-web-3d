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

  // Seed 0: Kertas Naskah Proklamasi (Dignified Archival Document with Softened Corners & Gentle Micro-Deckle)
  if (seed === 0) {
    const r = 0.045 // Corner soften curve radius
    const microNoise = (t: number) => Math.sin(t * 19.3) * 0.005 + Math.cos(t * 37.1) * 0.003

    // 1. Bottom edge (left to right): -w + r to w - r
    shape.moveTo(-w + r, -h + microNoise(0))
    const steps = 24
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const x = -w + r + t * (2 * w - 2 * r)
      shape.lineTo(x, -h + microNoise(t * 5.0))
    }
    // Bottom-right softened corner
    shape.quadraticCurveTo(w, -h, w, -h + r)

    // 2. Right edge (bottom to top): -h + r to h - r
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const y = -h + r + t * (2 * h - 2 * r)
      shape.lineTo(w + microNoise(t * 5.0 + 10), y)
    }
    // Top-right softened corner
    shape.quadraticCurveTo(w, h, w - r, h)

    // 3. Top edge (right to left): w - r to -w + r
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const x = w - r - t * (2 * w - 2 * r)
      shape.lineTo(x, h + microNoise(t * 5.0 + 20))
    }
    // Top-left softened corner
    shape.quadraticCurveTo(-w, h, -w, h - r)

    // 4. Left edge (top to bottom): h - r to -h + r
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const y = h - r - t * (2 * h - 2 * r)
      shape.lineTo(-w + microNoise(t * 5.0 + 30), y)
    }
    // Bottom-left softened corner
    shape.quadraticCurveTo(-w, -h, -w + r, -h)

    shape.closePath()
    return shape
  }

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
      seed === 5 && t > 0.32 && t < 0.68
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

// Procedural Canvas Texture for Kertas Naskah Proklamasi (Cross-Fold Creases & Archival Patina)
function useProclamationTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null

    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1440
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 1. Warm Aged Ivory Manila Base
    ctx.fillStyle = '#FAF6ED'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Vintage Vignette & Historical Aging Patina
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.22,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.72
    )
    grad.addColorStop(0, '#FFFDF8')
    grad.addColorStop(0.68, '#FAF3E5')
    grad.addColorStop(0.88, '#EFE4CE')
    grad.addColorStop(1, '#E4D4B9')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 3. Historical Paper Texture & Organic Fibers
    ctx.fillStyle = 'rgba(160, 135, 100, 0.06)'
    for (let i = 0; i < 1800; i++) {
      const px = Math.random() * canvas.width
      const py = Math.random() * canvas.height
      const pw = 1 + Math.random() * 2.5
      const ph = 0.6 + Math.random() * 1.2
      ctx.fillRect(px, py, pw, ph)
    }

    // 4. Subtle Historical Foxing & Age Patina Patches
    for (let i = 0; i < 24; i++) {
      const px = Math.random() * canvas.width
      const py = Math.random() * canvas.height
      const pr = 15 + Math.random() * 45
      const spotGrad = ctx.createRadialGradient(px, py, 0, px, py, pr)
      spotGrad.addColorStop(0, 'rgba(180, 150, 110, 0.045)')
      spotGrad.addColorStop(1, 'rgba(180, 150, 110, 0)')
      ctx.fillStyle = spotGrad
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.fill()
    }

    // 5. Authentic Historical Cross-Fold Creases (Naskah Proklamasi Fold Marks)
    // Horizontal Fold across y = 720 (Center)
    const midY = canvas.height * 0.5
    const hSpread = ctx.createLinearGradient(0, midY - 14, 0, midY + 14)
    hSpread.addColorStop(0, 'rgba(120, 100, 75, 0)')
    hSpread.addColorStop(0.48, 'rgba(120, 100, 75, 0.08)')
    hSpread.addColorStop(0.5, 'rgba(100, 80, 55, 0.26)') // Dark crease groove
    hSpread.addColorStop(0.52, 'rgba(255, 255, 255, 0.42)') // Light reflection ridge
    hSpread.addColorStop(0.56, 'rgba(255, 255, 255, 0.12)')
    hSpread.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = hSpread
    ctx.fillRect(20, midY - 14, canvas.width - 40, 28)

    // Vertical Fold across x = 512 (Center)
    const midX = canvas.width * 0.5
    const vSpread = ctx.createLinearGradient(midX - 14, 0, midX + 14, 0)
    vSpread.addColorStop(0, 'rgba(120, 100, 75, 0)')
    vSpread.addColorStop(0.48, 'rgba(120, 100, 75, 0.08)')
    vSpread.addColorStop(0.5, 'rgba(100, 80, 55, 0.26)') // Dark crease groove
    vSpread.addColorStop(0.52, 'rgba(255, 255, 255, 0.42)') // Light reflection ridge
    vSpread.addColorStop(0.56, 'rgba(255, 255, 255, 0.12)')
    vSpread.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = vSpread
    ctx.fillRect(midX - 14, 20, 28, canvas.height - 40)

    // 6. Classical Archival Double Frame Border
    ctx.strokeStyle = 'rgba(180, 150, 105, 0.22)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72)
    ctx.strokeStyle = 'rgba(180, 150, 105, 0.12)'
    ctx.lineWidth = 0.8
    ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88)

    // 7. Corner Dot Accents on the Inner Frame
    const corners = [
      [44, 44],
      [canvas.width - 44, 44],
      [44, canvas.height - 44],
      [canvas.width - 44, canvas.height - 44],
    ]
    ctx.fillStyle = 'rgba(180, 150, 105, 0.35)'
    for (const [cx, cy] of corners) {
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [])
}

// Physical 3D Torn Parchment Container with Synchronous Swapping Motion
function TornParchmentContainer3D({
  sectionIndex,
  activeSection,
  direction,
  paperTexture,
  proclamationTexture,
  children,
}: {
  sectionIndex: number
  activeSection: number
  direction: number
  paperTexture: THREE.CanvasTexture | null
  proclamationTexture?: THREE.CanvasTexture | null
  children?: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group | null>(null)
  const parchmentShape = useMemo(
    () => createTornParchmentShape(sectionIndex, 0.98, 1.38),
    [sectionIndex]
  )

  const isActive = sectionIndex === activeSection
  const isPreviousActive = useRef(isActive)
  const isProclamation = sectionIndex === 0
  const activeTexture = isProclamation ? proclamationTexture || paperTexture : paperTexture

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
      {/* 1. Realistic Clean Soft Drop Shadow (Flat Shape, Zero Bevel Artifacts) */}
      <mesh position={[0.024, -0.032, -0.02]}>
        <shapeGeometry args={[parchmentShape]} />
        <meshBasicMaterial color="#2B1D12" transparent opacity={0.14} />
      </mesh>

      {/* 2. Gilded Gold Leaf Deckle Underlay (Peeks along perimeter) */}
      <mesh position={[0, 0, -0.004]} scale={isProclamation ? [1.012, 1.008, 1] : [1.014, 1.01, 1]}>
        <shapeGeometry args={[parchmentShape]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.96}
          roughness={0.16}
          emissive="#524010"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3. 3D Parchment Slab Body (Radiant Ivory Cotton Rag Paper) */}
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry
          args={[
            parchmentShape,
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
          color={isProclamation ? '#FAF5EA' : '#FAF6EE'}
          roughness={isProclamation ? 0.8 : 0.76}
          metalness={0.02}
          emissive="#FFFFFF"
          emissiveIntensity={isProclamation ? 0.12 : 0.16}
          map={activeTexture || undefined}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Bespoke Physical Accents for this Act */}
      {children}
    </group>
  )
}

// 1. Act 00 Accents: Naskah Proklamasi Accents (Physical 3D Cross-Fold Creases & Royal Heritage Seal)
function Act00Accents() {
  const corners: [number, number][] = [
    [-0.92, 1.32],
    [0.92, 1.32],
    [-0.92, -1.32],
    [0.92, -1.32],
  ]

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Physical 3D Cross-Fold Creases across X and Y axis */}
      {/* Horizontal Fold Crease (y = 0) */}
      <group position={[0, 0, 0.032]}>
        <mesh position={[0, 0.001, 0]}>
          <planeGeometry args={[1.9, 0.005]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.45}
          />
        </mesh>
        <mesh position={[0, -0.002, 0]}>
          <planeGeometry args={[1.9, 0.007]} />
          <meshBasicMaterial color="#6B5945" transparent opacity={0.24} />
        </mesh>
      </group>

      {/* Vertical Fold Crease (x = 0) */}
      <group position={[0, 0, 0.032]}>
        <mesh position={[0.001, 0, 0]}>
          <planeGeometry args={[0.005, 2.7]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.45}
          />
        </mesh>
        <mesh position={[-0.002, 0, 0]}>
          <planeGeometry args={[0.007, 2.7]} />
          <meshBasicMaterial color="#6B5945" transparent opacity={0.24} />
        </mesh>
      </group>

      {/* 2. Official Royal Lacquer Wax Seal / Cap Naskah Proklamasi at Header */}
      <group position={[0, 1.26, 0.046]}>
        {/* Scalloped Red Wax Base */}
        <mesh>
          <cylinderGeometry args={[0.076, 0.084, 0.016, 24]} />
          <meshStandardMaterial
            color="#8A1C22"
            roughness={0.28}
            metalness={0.12}
            emissive="#380407"
            emissiveIntensity={0.22}
          />
        </mesh>
        {/* Concentric Gold Bezel Ring */}
        <mesh position={[0, 0.009, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.062, 0.006, 16, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.12} />
        </mesh>
        {/* Embossed Royal Diamond Monogram Crest */}
        <mesh position={[0, 0.01, 0]}>
          <octahedronGeometry args={[0.036, 0]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.96} roughness={0.12} />
        </mesh>
      </group>

      {/* 3. Antique Brass Archival Corner Brackets */}
      {corners.map(([cx, cy], idx) => (
        <group key={idx} position={[cx, cy, 0.034]}>
          <mesh>
            <boxGeometry args={[0.048, 0.048, 0.003]} />
            <meshStandardMaterial color="#C5A059" metalness={0.92} roughness={0.22} />
          </mesh>
        </group>
      ))}
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
  const proclamationTexture = useProclamationTexture()

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

        {/* 6 Sheets with Synchronized Physical Swapping (Act 00: Kertas Naskah Proklamasi) */}
        <TornParchmentContainer3D
          sectionIndex={0}
          activeSection={activeSection}
          direction={direction}
          paperTexture={paperTexture}
          proclamationTexture={proclamationTexture}
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
