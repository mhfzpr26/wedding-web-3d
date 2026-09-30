'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { markGuestAsOpened } from '@/actions/guests'
import { AudioPlayer } from '@/components/shared/AudioPlayer'
import type { InvitationProps } from '@/types'
import type { CoverState } from '@/types/cover'
import { CoverA } from './CoverA'
import { CoupleLayer } from './layers/CoupleLayer'
import { EventLayer } from './layers/EventLayer'
import { GiftLayer } from './layers/GiftLayer'
// Import 6 Dedicated Compact Layers (100% Viewport-Budgeted, Zero Internal Scroll)
import { OpeningLayer } from './layers/OpeningLayer'
import { RsvpLayer } from './layers/RsvpLayer'
import { WishesClosingLayer } from './layers/WishesClosingLayer'

// Dynamic import for R3F 3D Stage Canvas to ensure zero SSR hydration issues
const DynamicTemplateAStageCanvas = dynamic(
  () => import('@/components/three/TemplateAStageCanvas'),
  {
    ssr: false,
    loading: () => null,
  }
)

const TOTAL_SECTIONS = 6

export const TemplateA: React.FC<InvitationProps> = ({ couple, guest }) => {
  const [coverState, setCoverState] = useState<CoverState>('LOCKED')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const isTransitioningRef = useRef(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)

  const isOpened = coverState === 'OPENED'

  const handleOpenComplete = useCallback(() => {
    setCoverState('OPENED')
    setIsPlayingAudio(true)

    if (guest?.id) {
      markGuestAsOpened(guest.id).catch(console.error)
    }
  }, [guest])

  // Move to target section with transition lock (~650ms)
  const goToSection = useCallback(
    (targetIndex: number) => {
      if (isTransitioningRef.current) return
      if (targetIndex < 0 || targetIndex >= TOTAL_SECTIONS) return

      isTransitioningRef.current = true
      setDirection(targetIndex > activeSection ? 1 : -1)
      setActiveSection(targetIndex)

      setTimeout(() => {
        isTransitioningRef.current = false
      }, 650)
    },
    [activeSection]
  )

  // 1. Mouse Wheel Listener (Desktop): 1 wheel notch = 1 layer transition
  useEffect(() => {
    if (!isOpened) return

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if user is scrolling inside an open modal
      if ((e.target as HTMLElement)?.closest('.fixed.z-50')) return

      if (Math.abs(e.deltaY) < 22) return // Ignore tiny trackpad jitter

      if (e.deltaY > 0) {
        goToSection(activeSection + 1)
      } else {
        goToSection(activeSection - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isOpened, activeSection, goToSection])

  // 2. Touch Swipe Listener (Mobile): 1 swipe = 1 layer transition
  useEffect(() => {
    if (!isOpened) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      // Don't intercept if interacting with an open modal
      if ((e.target as HTMLElement)?.closest('.fixed.z-50')) return

      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const deltaX = touchStartX.current - e.changedTouches[0].clientX

      // Check if vertical swipe is dominant and exceeds threshold (40px)
      if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 0) {
          // Swipe up -> Next section
          goToSection(activeSection + 1)
        } else {
          // Swipe down -> Previous section
          goToSection(activeSection - 1)
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpened, activeSection, goToSection])

  // 3. Keyboard Arrow Keys Listener
  useEffect(() => {
    if (!isOpened) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') return

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goToSection(activeSection + 1)
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goToSection(activeSection - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpened, activeSection, goToSection])

  // Cover Unboxing State
  if (!isOpened) {
    return (
      <div
        data-template="TEMPLATE_A"
        className="fixed inset-0 h-screen overflow-hidden touch-none z-50 bg-[#F4F1EA] flex justify-center selection:bg-[#B39365] selection:text-white"
      >
        <div className="w-full max-w-md bg-[#FAF8F5] shadow-2xl relative overflow-hidden flex flex-col h-full">
          <CoverA couple={couple} guest={guest} onOpenComplete={handleOpenComplete} />
        </div>
      </div>
    )
  }

  // 6 Continuous Acts
  const SECTIONS = [
    {
      id: 'act-opening',
      num: '01',
      title: 'Pembuka',
      component: <OpeningLayer couple={couple} guest={guest} />,
    },
    {
      id: 'act-couple',
      num: '02',
      title: 'Kedua Mempelai',
      component: <CoupleLayer couple={couple} />,
    },
    {
      id: 'act-event',
      num: '03',
      title: 'Rangkaian Acara',
      component: <EventLayer couple={couple} />,
    },
    {
      id: 'act-gift',
      num: '04',
      title: 'Tanda Kasih',
      component: <GiftLayer bankAccounts={couple.bankAccounts} />,
    },
    {
      id: 'act-rsvp',
      num: '05',
      title: 'Konfirmasi RSVP',
      component: <RsvpLayer couple={couple} guest={guest} />,
    },
    {
      id: 'act-wishes-closing',
      num: '06',
      title: 'Doa & Penutup',
      component: <WishesClosingLayer couple={couple} />,
    },
  ]

  const currentSection = SECTIONS[activeSection]

  return (
    <div
      data-template="TEMPLATE_A"
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFFDF9] via-[#FAF6F0] to-[#EFE7DC] text-[#1B2A4A] selection:bg-[#B39365] selection:text-white touch-none"
    >
      {/* 1. 3D WebGL Physical Torn Parchment Stage Canvas (Apple-style Camera Choreography) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <DynamicTemplateAStageCanvas activeSection={activeSection} direction={direction} />
      </div>

      {/* 2. Responsive Subtle Couple Monogram Watermark in Background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40">
        <span className="font-serif text-[120px] sm:text-[180px] md:text-[230px] italic font-light text-[#D4AF37]/[0.05] tracking-widest translate-y-[-20px]">
          {couple.groomName.charAt(0)}&amp;{couple.brideName.charAt(0)}
        </span>
      </div>

      {/* 3. Minimal Desktop Architectural Frame Line */}
      <div className="hidden md:flex fixed inset-y-0 inset-x-8 lg:inset-x-14 justify-between pointer-events-none z-0">
        <div className="w-px h-full bg-[#D4AF37]/10" />
        <div className="w-px h-full bg-[#D4AF37]/10" />
      </div>

      {/* 4. Floating Background Music Player */}
      {couple.backgroundMusicUrl && (
        <AudioPlayer
          src={couple.backgroundMusicUrl}
          isPlaying={isPlayingAudio}
          onToggle={() => setIsPlayingAudio(!isPlayingAudio)}
        />
      )}

      {/* 5. Top Floating Subtle Masthead & Status Indicator */}
      <header className="fixed top-3.5 sm:top-5 inset-x-0 z-20 pointer-events-none select-none flex items-center justify-between px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-[#8C7851] uppercase bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E2D9CE] shadow-sm">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>
            {couple.groomName.split(',')[0]} &amp; {couple.brideName.split(',')[0]}
          </span>
        </div>

        {/* Minimalist Slide Counter (Status only, no buttons) */}
        <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold text-[#8C7851] bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E2D9CE] shadow-sm">
          <span>0{activeSection + 1}</span>
          <span className="text-[#8A7968]/40">/</span>
          <span className="text-[#8A7968]/60">0{TOTAL_SECTIONS}</span>
        </div>
      </header>

      {/* 6. Minimalist Progress Track on the Left Edge */}
      <div className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-2 pointer-events-none select-none">
        {SECTIONS.map((sec, idx) => (
          <div
            key={sec.id}
            className={`w-1 rounded-full transition-all duration-500 ${
              activeSection === idx ? 'h-6 sm:h-8 bg-[#D4AF37] shadow-sm' : 'h-1.5 bg-[#D5CBBC]/60'
            }`}
          />
        ))}
      </div>

      {/* 7. Centered Viewport-Budgeted Layer Content Printed Directly on 3D Torn Paper Container */}
      <main className="relative z-10 w-full h-[100dvh] flex items-center justify-center p-3 sm:p-5 md:p-6 pt-10 sm:pt-12 pb-6 sm:pb-8">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentSection.id}
            initial={{
              opacity: 0,
              y: direction * 48,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: direction * -48,
              scale: 0.96,
            }}
            transition={{
              duration: 0.46,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[330px] sm:max-w-[355px] md:max-w-[385px] select-text relative"
          >
            {/* Bespoke Layer Content */}
            {currentSection.component}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default TemplateA
