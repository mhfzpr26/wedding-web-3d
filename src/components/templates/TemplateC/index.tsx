'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { InvitationProps } from '@/types'
import { AudioPlayer } from '@/components/shared/AudioPlayer'
import { markGuestAsOpened } from '@/actions/guests'
import { CoverC } from './CoverC'
import { FloatingCrystalShards } from './FloatingCrystalShards'
import { CoupleSlab } from './slabs/CoupleSlab'
import { MomentSlab } from './slabs/MomentSlab'
import { GiftVaultSlab } from './slabs/GiftVaultSlab'
import { RsvpWhispersSlab } from './slabs/RsvpWhispersSlab'
import type { CoverState } from '@/types/cover'

interface ZAxisSlabItemProps {
  index: number
  total: number
  children: React.ReactNode
}

const ZAxisSlabItem: React.FC<ZAxisSlabItemProps> = ({
  index,
  total,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isLast = index === total - 1

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Spatial Z-Axis movement: slab zooms past toward the camera and dissolves as next slab arrives
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 1.05])
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, isLast ? 1 : 0.75, isLast ? 1 : 0.45])
  const z = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 70])
  const y = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : -15])

  return (
    <div
      ref={containerRef}
      className="relative mb-16 sm:mb-24 last:mb-0"
      style={{
        zIndex: (index + 1) * 10,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          z,
          y,
          transformStyle: 'preserve-3d',
        }}
        className="sticky top-6 sm:top-10 origin-center transition-all duration-300"
      >
        {children}
      </motion.div>
    </div>
  )
}

export const TemplateC: React.FC<InvitationProps> = ({ couple, guest }) => {
  const [coverState, setCoverState] = useState<CoverState>('LOCKED')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const mainScrollRef = useRef<HTMLDivElement>(null)

  const isOpened = coverState === 'OPENED'

  const handleOpenComplete = useCallback(() => {
    setCoverState('OPENED')
    setIsPlayingAudio(true)

    if (guest?.id) {
      markGuestAsOpened(guest.id).catch(console.error)
    }
  }, [guest])

  // 1. HARD LOCK VIEWPORT (Cover Unboxing State)
  // Content below is NOT mounted to DOM prior to OPENED
  if (!isOpened) {
    return (
      <div
        data-template="TEMPLATE_C"
        className="h-screen overflow-hidden bg-[#EEF2EC] py-0 md:py-8 flex justify-center selection:bg-teal-700 selection:text-white font-sans text-slate-800"
      >
        <div className="w-full max-w-md bg-gradient-to-b from-[#F5F8F4] via-[#EEF2EC] to-[#E5EBE3] shadow-2xl relative overflow-hidden flex flex-col h-full border-x border-white/50">
          <CoverC
            couple={couple}
            guest={guest}
            onOpenComplete={handleOpenComplete}
          />
        </div>
      </div>
    )
  }

  // 2. Z-AXIS FLOATING SLABS (When OPENED)
  const slabs = [
    {
      id: 'couple-slab',
      component: <CoupleSlab couple={couple} guest={guest} />,
    },
    {
      id: 'moment-slab',
      component: <MomentSlab couple={couple} />,
    },
    {
      id: 'gift-vault-slab',
      component: <GiftVaultSlab bankAccounts={couple.bankAccounts} />,
    },
    {
      id: 'rsvp-whispers-slab',
      component: <RsvpWhispersSlab couple={couple} guest={guest} />,
    },
  ]

  return (
    <div
      ref={mainScrollRef}
      data-template="TEMPLATE_C"
      className="min-h-screen bg-gradient-to-b from-[#F5F8F4] via-[#EEF2EC] to-[#E5EBE3] py-0 md:py-8 flex justify-center selection:bg-teal-700 selection:text-white relative overflow-x-hidden"
    >
      {/* Ambient Glow Ornaments */}
      <div className="fixed top-12 -left-20 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-96 -right-20 w-80 h-80 bg-emerald-100/45 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-20 left-10 w-72 h-72 bg-amber-100/35 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Audio Player */}
      {couple.backgroundMusicUrl && (
        <AudioPlayer
          src={couple.backgroundMusicUrl}
          isPlaying={isPlayingAudio}
          onToggle={() => setIsPlayingAudio(!isPlayingAudio)}
        />
      )}

      {/* Background Floating Crystal Shards Parallax */}
      <FloatingCrystalShards containerRef={mainScrollRef} />

      {/* Spatial 3D Container */}
      <div
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
        className="w-full max-w-md bg-transparent text-slate-800 relative z-10 px-4 sm:px-5 py-6 sm:py-8 pb-28 sm:pb-36 animate-in fade-in duration-700"
      >
        {/* Top Frosted Glass Title Tag */}
        <div className="text-center mb-6 space-y-1">
          <span className="inline-block text-[10px] font-mono tracking-[0.25em] text-teal-800 uppercase backdrop-blur-md bg-white/70 px-4 py-1 rounded-full border border-white/80 shadow-2xs">
            Crystalline Glass Suite
          </span>
          <p className="text-xs font-serif italic text-slate-500">
            {couple.groomName.split(',')[0]} &amp; {couple.brideName.split(',')[0]}
          </p>
        </div>

        {/* 3D Z-Axis Floating Slabs */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {slabs.map((slab, index) => (
            <ZAxisSlabItem
              key={slab.id}
              index={index}
              total={slabs.length}
            >
              {slab.component}
            </ZAxisSlabItem>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TemplateC
