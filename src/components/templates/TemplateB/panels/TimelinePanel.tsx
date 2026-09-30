'use client'

import { ArrowUpRight, Calendar, CalendarPlus, Clock, MapPin } from 'lucide-react'
import React from 'react'
import { Countdown } from '@/components/shared/Countdown'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { formatDate, formatTime } from '@/lib/utils'
import type { CoupleWithDetails, Event } from '@/types'

interface TimelinePanelProps {
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

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ couple }) => {
  const coupleNames = `${couple.groomName.split(',')[0]} & ${couple.brideName.split(',')[0]}`

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto overscroll-contain select-none scrollbar-none">
      {/* 1. Masthead */}
      <div className="border-b border-neutral-900 pb-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-950">
          INDEX // 02 &bull; THE TIMELINE
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
          AGENDA &bull; PROTOCOL
        </span>
      </div>

      {/* 2. Timeline Body */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 block mb-1">
            ITINERARY OF EVENTS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950 uppercase">
            Order of the Day
          </h2>
        </div>

        {/* Countdown Centerpiece */}
        {couple.events.length > 0 && (
          <div className="border border-neutral-950 p-4 bg-white shadow-xs">
            <p className="font-mono text-[10px] uppercase tracking-widest text-center text-neutral-500 mb-3">
              T-MINUS TO CEREMONY
            </p>
            <Countdown targetDate={couple.events[0].startTime} />
          </div>
        )}

        {/* Events Grid (Akad and Resepsi side-by-side or stacked with hairline architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {couple.events.map((event: Event, idx: number) => {
            const gCalUrl = createGoogleCalendarUrl(event, coupleNames)

            return (
              <div
                key={event.id}
                className="border-t-2 border-neutral-950 pt-3 pb-4 space-y-3 bg-white p-4 border-x border-b border-neutral-900/10"
              >
                <div className="flex justify-between items-baseline font-mono text-[10px]">
                  <span className="font-bold text-neutral-950 uppercase">PHASE 0{idx + 1}</span>
                  <span className="text-neutral-500 uppercase tracking-wider">
                    {idx === 0 ? 'SOLEMNIZATION' : 'RECEPTION'}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-light text-neutral-950">{event.title}</h3>

                <div className="font-mono text-xs text-neutral-600 space-y-2 border-l border-neutral-300 pl-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                    <span>{formatDate(event.startTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                    <span>
                      {formatTime(event.startTime)} &mdash;{' '}
                      {event.endTime ? formatTime(event.endTime) : 'SELESAI'} WIB
                    </span>
                  </div>
                  <div className="flex items-start space-x-2 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-950 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">{event.locationName}</p>
                      <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
                        {event.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href={gCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    <CalendarPlus className="w-3 h-3 text-neutral-300" />
                    <span>Add to Calendar</span>
                  </a>

                  {event.mapsUrl && (
                    <a
                      href={event.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 border border-neutral-950 text-neutral-950 font-mono text-[10px] uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                    >
                      <span>Google Maps</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dress Code Protocol */}
        {couple.dressCodeDesc && (
          <div className="border border-neutral-900/20 p-4 bg-white space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              DRESS CODE PROTOCOL
            </span>
            <p className="font-sans text-xs text-neutral-800 leading-relaxed">
              {couple.dressCodeDesc}
            </p>
            {couple.dressCodeColors.length > 0 && (
              <div className="flex items-center space-x-2 pt-1">
                {couple.dressCodeColors.map((color: string, i: number) => (
                  <div
                    key={i}
                    className="w-5 h-5 border border-neutral-400"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prewedding Cinematography Video */}
        {couple.videoUrl && (
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">
              CINEMATOGRAPHY REEL
            </span>
            <VideoPlayer url={couple.videoUrl} />
          </div>
        )}
      </div>

      {/* 3. Bottom Guide */}
      <div className="border-t border-neutral-900/15 pt-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          &larr; PREVIOUS
        </span>
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          SWIPE FOR REGISTRY &rarr;
        </span>
      </div>
    </div>
  )
}

export default TimelinePanel
