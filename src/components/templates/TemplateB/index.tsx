'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { markGuestAsOpened } from '@/actions/guests'
import { AudioPlayer } from '@/components/shared/AudioPlayer'
import type { InvitationProps } from '@/types'
import type { CoverState } from '@/types/cover'
import { CoverB } from './CoverB'
import { RegistryPanel } from './panels/RegistryPanel'
import { RsvpWordsPanel } from './panels/RsvpWordsPanel'
import { TimelinePanel } from './panels/TimelinePanel'
import { UnionPanel } from './panels/UnionPanel'
import { RunwayProgress } from './RunwayProgress'

export const TemplateB: React.FC<InvitationProps> = ({ couple, guest }) => {
  const [coverState, setCoverState] = useState<CoverState>('LOCKED')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activePanel, setActivePanel] = useState(0)
  const runwayRef = useRef<HTMLDivElement>(null)

  const isOpened = coverState === 'OPENED'

  const handleOpenComplete = useCallback(() => {
    setCoverState('OPENED')
    setIsPlayingAudio(true)

    if (guest?.id) {
      markGuestAsOpened(guest.id).catch(console.error)
    }
  }, [guest])

  // Scroll listener to update active panel indicator
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.clientWidth > 0) {
      const index = Math.round(el.scrollLeft / el.clientWidth)
      setActivePanel(Math.min(3, Math.max(0, index)))
    }
  }

  // Smooth scroll programmatically when stepper is clicked
  const handleNavigate = (index: number) => {
    if (runwayRef.current) {
      const targetLeft = index * runwayRef.current.clientWidth
      runwayRef.current.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      })
      setActivePanel(index)
    }
  }

  // 1. HARD LOCK VIEWPORT (Cover Unboxing State)
  // Content below is NOT mounted to DOM prior to OPENED
  if (!isOpened) {
    return (
      <div
        data-template="TEMPLATE_B"
        className="h-screen overflow-hidden bg-[#F5F5F3] py-0 md:py-8 flex justify-center selection:bg-neutral-900 selection:text-white font-sans text-neutral-900"
      >
        <div className="w-full max-w-md bg-[#FAFAF8] shadow-2xl relative overflow-hidden flex flex-col h-full border-x border-neutral-200">
          <CoverB couple={couple} guest={guest} onOpenComplete={handleOpenComplete} />
        </div>
      </div>
    )
  }

  // 2. HORIZONTAL RUNWAY LAYOUT (When OPENED)
  return (
    <div
      data-template="TEMPLATE_B"
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#FAFAF8] text-neutral-900 font-sans selection:bg-neutral-950 selection:text-white"
    >
      {/* Floating Audio Player */}
      {couple.backgroundMusicUrl && (
        <AudioPlayer
          src={couple.backgroundMusicUrl}
          isPlaying={isPlayingAudio}
          onToggle={() => setIsPlayingAudio(!isPlayingAudio)}
        />
      )}

      {/* Main Horizontal Runway Snap Container */}
      <div
        ref={runwayRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex flex-row scrollbar-none touch-pan-x overscroll-x-contain"
      >
        {/* Panel 01: The Union */}
        <section
          id="panel-union"
          className="w-screen h-full shrink-0 snap-center snap-always flex flex-col bg-[#FAFAF8] border-r border-neutral-900/10 pb-14 sm:pb-16"
        >
          <div className="w-full max-w-3xl mx-auto h-full">
            <UnionPanel couple={couple} guest={guest} />
          </div>
        </section>

        {/* Panel 02: The Timeline */}
        <section
          id="panel-timeline"
          className="w-screen h-full shrink-0 snap-center snap-always flex flex-col bg-[#FAFAF8] border-r border-neutral-900/10 pb-14 sm:pb-16"
        >
          <div className="w-full max-w-3xl mx-auto h-full">
            <TimelinePanel couple={couple} />
          </div>
        </section>

        {/* Panel 03: The Registry */}
        <section
          id="panel-registry"
          className="w-screen h-full shrink-0 snap-center snap-always flex flex-col bg-[#FAFAF8] border-r border-neutral-900/10 pb-14 sm:pb-16"
        >
          <div className="w-full max-w-3xl mx-auto h-full">
            <RegistryPanel bankAccounts={couple.bankAccounts} />
          </div>
        </section>

        {/* Panel 04: RSVP & Words */}
        <section
          id="panel-rsvp-words"
          className="w-screen h-full shrink-0 snap-center snap-always flex flex-col bg-[#FAFAF8] pb-14 sm:pb-16"
        >
          <div className="w-full max-w-4xl mx-auto h-full">
            <RsvpWordsPanel couple={couple} guest={guest} />
          </div>
        </section>
      </div>

      {/* Bottom Editorial Progress & Navigation Bar */}
      <RunwayProgress currentIndex={activePanel} totalPanels={4} onNavigate={handleNavigate} />
    </div>
  )
}

export default TemplateB
