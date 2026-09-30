'use client'

import { ThreeEvent, useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { playGlassShatterSound, playGlassTickSound } from '@/lib/audioFeedback'

export type GlassState = 'INTACT' | 'CRACKED' | 'SHATTERING' | 'OPENED'

export interface TemplateCCover3DProps {
  glassState: GlassState
  setGlassState: (state: GlassState) => void
  onOpenComplete: () => void
  forceOpen?: boolean
}

const SHARD_COUNT = 32

export const TemplateCCover3D: React.FC<TemplateCCover3DProps> = ({
  glassState,
  setGlassState,
  onOpenComplete,
  forceOpen = false,
}) => {
  const groupRef = useRef<THREE.Group | null>(null)
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null)
  const crackGroupRef = useRef<THREE.Group | null>(null)
  const glassPlaneRef = useRef<THREE.Mesh | null>(null)
  const shardMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  const [crackPoint, setCrackPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [shatterStartTime, setShatterStartTime] = useState<number | null>(null)
  const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false)

  // Dummy object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Shard initial physics data
  const shardsData = useMemo(() => {
    const data = []
    for (let i = 0; i < SHARD_COUNT; i++) {
      // Distributed across the card rectangular surface
      const x0 = (Math.random() - 0.5) * 2.2
      const y0 = (Math.random() - 0.5) * 1.5
      const z0 = 0.06

      // Velocity outwards from center with upward burst
      const angle = Math.atan2(y0, x0) + (Math.random() - 0.5) * 0.5
      const speed = 2.2 + Math.random() * 3.2
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed + 1.2 // slight upward explosion
      const vz = 1.0 + Math.random() * 2.5 // flying forward towards camera

      // Rotational speeds
      const rx = (Math.random() - 0.5) * 14
      const ry = (Math.random() - 0.5) * 14
      const rz = (Math.random() - 0.5) * 14

      // Scale variation
      const scale = 0.7 + Math.random() * 0.7

      data.push({
        x: x0,
        y: y0,
        z: z0,
        vx,
        vy,
        vz,
        rx,
        ry,
        rz,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scale,
      })
    }
    return data
  }, [])

  // Shard crystal geometry (faceted prism / sharp triangle cone)
  const shardGeometry = useMemo(() => {
    return new THREE.ConeGeometry(0.14, 0.28, 3)
  }, [])

  // Handle pointer tap on the glass
  const handleTap = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()

    if (glassState === 'INTACT') {
      const p = e.point
      setCrackPoint({ x: p.x, y: p.y })
      setGlassState('CRACKED')
      playGlassTickSound()
    } else if (glassState === 'CRACKED') {
      triggerShatter()
    }
  }

  const triggerShatter = () => {
    if (glassState === 'SHATTERING' || glassState === 'OPENED') return
    setGlassState('SHATTERING')
    setShatterStartTime(performance.now())
    playGlassShatterSound()
  }

  // Handle force open button
  useEffect(() => {
    if (forceOpen && glassState !== 'SHATTERING' && glassState !== 'OPENED') {
      triggerShatter()
    }
  }, [forceOpen])

  // Radial crack branches for CRACKED state
  const crackBranches = useMemo(() => {
    const branches = []
    const count = 10
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
      const length = 0.4 + Math.random() * 0.45
      branches.push({ angle, length })
    }
    return branches
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Gentle hover when intact or cracked
    if (groupRef.current && (glassState === 'INTACT' || glassState === 'CRACKED')) {
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.04
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.03
    }

    // Animate flying shards when SHATTERING
    if (glassState === 'SHATTERING' && instancedMeshRef.current && shatterStartTime) {
      const elapsed = (performance.now() - shatterStartTime) / 1000

      // Update each shard instance
      shardsData.forEach((shard, i) => {
        // Physics update
        shard.x += shard.vx * delta
        shard.y += shard.vy * delta
        shard.vy -= 8.5 * delta // Gravity downward
        shard.z += shard.vz * delta

        shard.rotX += shard.rx * delta
        shard.rotY += shard.ry * delta
        shard.rotZ += shard.rz * delta

        dummy.position.set(shard.x, shard.y, shard.z)
        dummy.rotation.set(shard.rotX, shard.rotY, shard.rotZ)
        dummy.scale.set(shard.scale, shard.scale, shard.scale)
        dummy.updateMatrix()

        instancedMeshRef.current?.setMatrixAt(i, dummy.matrix)
      })

      instancedMeshRef.current.instanceMatrix.needsUpdate = true

      // Fade out shard opacity
      if (shardMaterialRef.current) {
        shardMaterialRef.current.opacity = Math.max(0, 0.95 - elapsed * 1.1)
      }

      // Complete transition after 0.85s
      if (elapsed > 0.85 && !hasTriggeredComplete) {
        setHasTriggeredComplete(true)
        setGlassState('OPENED')
        onOpenComplete()
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Underlying Invitation Card (Soft Sage Glow) */}
      <group position={[0, 0, 0]}>
        {/* Card Slab */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.3, 1.55, 0.03]} />
          <meshStandardMaterial color="#FAFDF9" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Sage Inner Glow Plane */}
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[2.14, 1.39]} />
          <meshStandardMaterial color="#E3EDE4" roughness={0.4} />
        </mesh>
        {/* Gold Inset Ring Accent */}
        <mesh position={[0, 0.15, 0.02]}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.8} />
        </mesh>
        {/* Monogram Detail */}
        <mesh position={[0, -0.22, 0.02]}>
          <planeGeometry args={[1.2, 0.22]} />
          <meshStandardMaterial color="#334B42" roughness={0.5} />
        </mesh>
      </group>

      {/* 2. Intact & Cracked Frosted Acrylic Glass Layer */}
      {glassState !== 'SHATTERING' && glassState !== 'OPENED' && (
        <group>
          {/* Main Translucent Glass Pane */}
          <mesh ref={glassPlaneRef} position={[0, 0, 0.05]} onPointerDown={handleTap}>
            <boxGeometry args={[2.36, 1.62, 0.05]} />
            <meshPhysicalMaterial
              color="#F0F8F4"
              transmission={0.6}
              roughness={0.2}
              ior={1.48}
              thickness={0.5}
              transparent={true}
              opacity={0.92}
              reflectivity={0.6}
              clearcoat={0.9}
            />
          </mesh>

          {/* Radial Crack Overlay when CRACKED */}
          {glassState === 'CRACKED' && (
            <group
              ref={crackGroupRef}
              position={[crackPoint.x, crackPoint.y, 0.08]}
              onPointerDown={handleTap}
            >
              {/* Central Impact Dot */}
              <mesh position={[0, 0, 0]}>
                <circleGeometry args={[0.04, 16]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
              </mesh>

              {/* Concentric Impact Shock Rings */}
              <mesh position={[0, 0, 0.001]}>
                <ringGeometry args={[0.07, 0.085, 24]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
              </mesh>
              <mesh position={[0, 0, 0.001]}>
                <ringGeometry args={[0.16, 0.175, 24]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={0.45} />
              </mesh>

              {/* Radiating Crack Lines */}
              {crackBranches.map((b, idx) => (
                <mesh
                  key={idx}
                  position={[
                    (Math.cos(b.angle) * b.length) / 2,
                    (Math.sin(b.angle) * b.length) / 2,
                    0.002,
                  ]}
                  rotation={[0, 0, b.angle]}
                >
                  <planeGeometry args={[b.length, 0.012]} />
                  <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}

      {/* 3. InstancedMesh Crystal Shards (Active during SHATTERING) */}
      {glassState === 'SHATTERING' && (
        <instancedMesh ref={instancedMeshRef} args={[shardGeometry, undefined, SHARD_COUNT]}>
          <meshPhysicalMaterial
            ref={shardMaterialRef}
            color="#E8F8F5"
            transmission={0.85}
            roughness={0.15}
            ior={1.52}
            thickness={0.4}
            transparent={true}
            opacity={0.95}
            reflectivity={0.8}
            clearcoat={1.0}
          />
        </instancedMesh>
      )}
    </group>
  )
}

export default TemplateCCover3D
