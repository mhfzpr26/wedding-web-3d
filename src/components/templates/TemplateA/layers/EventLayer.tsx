'use client'

import { Calendar, CalendarPlus, Clock, ExternalLink, MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { Countdown } from '@/components/shared/Countdown'
import { formatDate, formatTime } from '@/lib/utils'
import type { CoupleWithDetails, Event } from '@/types'

interface EventLayerProps {
  couple: CoupleWithDetails
}

function createGoogleCalendarUrl(event: Event, coupleNames: string) {
  try {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d+/g, '')
    const end = event.endTime
      ? new Date(event.endTime).toISOString().replace(/-|:|\.\d+/g, '')
      : new Date(new Date(event.startTime).getTime() + 2 * 60 * 60 * 1000)
          .toISOString()
          .replace(/-|:|\.\d+/g, '')

    const text = encodeURIComponent(`${event.title} - ${coupleNames}`)
    const details = encodeURIComponent(
      `Pernikahan ${coupleNames}\nAcara: ${event.title}\nLokasi: ${event.locationName}\nAlamat: ${event.address}`
    )
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
  } catch {
    return '#'
  }
}

export const EventLayer: React.FC<EventLayerProps> = ({ couple }) => {
  const coupleNames = `${couple.groomName.split(',')[0]} & ${couple.brideName.split(',')[0]}`
  const events = couple.events || []
  const [selectedEventIndex, setSelectedEventIndex] = useState(0)

  const activeEvent = events[selectedEventIndex] || events[0]

  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">
      <div className="space-y-0.5 mb-2.5">
        <h2 className="text-2xl sm:text-[28px] md:text-3xl font-serif text-[#1B2A4A]">
          Rangkaian Acara
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#8A7968]">
          Menghitung hari menuju ikatan suci kedua mempelai
        </p>
      </div>

      {/* Countdown Timer Stub */}
      {events.length > 0 && (
        <div className="scale-95 sm:scale-100 -my-0.5">
          <Countdown targetDate={events[0].startTime} variant="clean" />
        </div>
      )}

      {/* Dotted Perforation Stitch Line */}
      <div className="my-2.5 border-t border-dashed border-[#D4AF37]/45 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#FAF8F5]/90 px-2.5 text-[10px] sm:text-[11px] md:text-xs font-mono tracking-widest text-[#8C7851] uppercase">
          Admit One &bull; VIP Pass
        </span>
      </div>

      {/* Event Tabs Switcher */}
      {events.length > 1 && (
        <div className="flex justify-center space-x-2 mb-2">
          {events.map((ev, idx) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => setSelectedEventIndex(idx)}
              className={`px-3.5 py-1 rounded-full text-[13px] sm:text-sm md:text-base font-serif transition-all cursor-pointer ${
                selectedEventIndex === idx
                  ? 'bg-[#1B2A4A] text-[#FAF8F5] shadow-sm font-bold'
                  : 'bg-[#FAF8F5]/85 text-[#8C7851] border border-[#E2D9CE] hover:bg-white'
              }`}
            >
              {ev.title}
            </button>
          ))}
        </div>
      )}

      {/* Active Event Pass Details */}
      {activeEvent && (
        <div className="space-y-2 text-left pt-1">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-1.5">
            <span className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#1B2A4A]">
              {activeEvent.title}
            </span>
            <div className="flex items-center space-x-1.5 text-[13px] sm:text-sm md:text-base text-[#8C7851] font-mono">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{formatDate(activeEvent.startTime)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] sm:text-sm md:text-base">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-[#8C7851] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1B2A4A] block">Waktu:</span>
                <span className="text-[#556270]">
                  {formatTime(activeEvent.startTime)} -{' '}
                  {activeEvent.endTime ? formatTime(activeEvent.endTime) : 'Selesai'}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#8C7851] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1B2A4A] block">Lokasi:</span>
                <span className="text-[#556270] line-clamp-2">{activeEvent.locationName}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Calendar & Maps */}
          <div className="flex items-center space-x-2 pt-2 border-t border-[#E2D9CE]/60">
            <a
              href={createGoogleCalendarUrl(activeEvent, coupleNames)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-[#E2D9CE] text-xs sm:text-sm md:text-base font-serif text-[#1B2A4A] hover:bg-[#FAF8F5] transition-all shadow-sm"
            >
              <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>Simpan ke Kalender</span>
            </a>

            {activeEvent.mapsUrl && (
              <a
                href={activeEvent.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1B2A4A] text-xs sm:text-sm md:text-base font-serif text-[#FAF8F5] hover:bg-[#24375F] transition-all shadow-sm"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Petunjuk Arah</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventLayer
