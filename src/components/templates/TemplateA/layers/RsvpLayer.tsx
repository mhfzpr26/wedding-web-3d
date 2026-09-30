'use client'

import React from 'react'
import { RsvpForm } from '@/components/shared/RsvpForm'
import type { CoupleWithDetails, Guest } from '@/types'

interface RsvpLayerProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}

export const RsvpLayer: React.FC<RsvpLayerProps> = ({ couple, guest }) => {
  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">
      <div className="space-y-0.5 mb-2.5">
        <h2 className="text-2xl sm:text-[28px] md:text-3xl font-serif text-[#1B2A4A]">
          Konfirmasi Kehadiran
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#8A7968]">
          Mohon konfirmasikan kehadiran Anda untuk kemudahan pengaturan tempat
        </p>
      </div>

      {/* Compact RSVP Form Container */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto text-left">
        <RsvpForm
          coupleId={couple.id}
          guest={guest}
          slug={couple.slug}
          variant="clean"
          className="p-0 text-left"
        />
      </div>
    </div>
  )
}

export default RsvpLayer
