'use client'

import { Calendar, CalendarPlus, Clock, ExternalLink, MapPin, Sparkles } from 'lucide-react'
import React from 'react'
import { Countdown } from '@/components/shared/Countdown'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { formatDate, formatTime } from '@/lib/utils'
import type { CoupleWithDetails, Event } from '@/types'

interface MomentSlabProps {
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

export const MomentSlab: React.FC<MomentSlabProps> = ({ couple }) => {
  const coupleNames = `${couple.groomName.split(',')[0]} & ${couple.brideName.split(',')[0]}`

  return (
    <div className="w-full rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient Glare */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-teal-200/30 via-emerald-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Slab Indicator Tag */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <span className="text-[10px] font-mono tracking-widest text-teal-800 uppercase backdrop-blur-md bg-white/60 px-3 py-1 rounded-full border border-white/70 shadow-2xs">
          Slab 02 &bull; Sacred Moment
        </span>
        <div className="flex items-center space-x-1 text-teal-600">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center relative z-10 space-y-1 mt-2">
        <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-teal-800 backdrop-blur-md bg-white/60 px-3 py-0.5 rounded-full border border-white/70">
          Rangkaian Acara
        </span>
        <h2 className="text-2xl font-serif text-slate-900">Hari Bahagia</h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto">
          Dengan penuh rasa syukur, kami mengundang kehadiran Anda pada prosesi sakral kami:
        </p>
      </div>

      {/* Countdown Centerpiece */}
      {couple.events.length > 0 && (
        <div className="mt-5 mb-6 relative z-10 p-4 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs">
          <Countdown targetDate={couple.events[0].startTime} />
        </div>
      )}

      {/* Event Cards */}
      <div className="space-y-4 relative z-10">
        {couple.events.map((event: Event, idx: number) => {
          const gCalUrl = createGoogleCalendarUrl(event, coupleNames)

          return (
            <div
              key={event.id}
              className="p-5 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                <h3 className="font-serif text-lg font-semibold text-slate-900">{event.title}</h3>
                <span className="text-[10px] font-medium uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  Sesi 0{idx + 1}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-2xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-900">{formatDate(event.startTime)}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-2xs">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-900">
                    {formatTime(event.startTime)} &mdash;{' '}
                    {event.endTime ? formatTime(event.endTime) : 'Selesai'} WIB
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 pt-0.5">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-2xs shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{event.locationName}</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
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
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-medium backdrop-blur-md bg-teal-800 text-white hover:bg-teal-900 transition-colors shadow-xs"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Tambah ke Kalender</span>
                </a>

                {event.mapsUrl && (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-medium backdrop-blur-md bg-white text-teal-900 border border-teal-200/70 hover:bg-teal-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dress Code Section */}
      {couple.dressCodeDesc && (
        <div className="mt-4 p-4 rounded-2xl backdrop-blur-md bg-white/50 border border-white/80 text-center space-y-2 relative z-10">
          <p className="text-xs font-semibold text-slate-900">Ketentuan Busana (Dress Code)</p>
          <p className="text-xs text-slate-600">{couple.dressCodeDesc}</p>
          {couple.dressCodeColors.length > 0 && (
            <div className="flex items-center justify-center space-x-2 pt-1">
              {couple.dressCodeColors.map((color: string, idx: number) => (
                <span
                  key={idx}
                  className="w-5 h-5 rounded-full border border-white shadow-xs"
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
        <div className="mt-5 pt-4 border-t border-slate-200/60 relative z-10 space-y-2">
          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-teal-800 block text-center">
            Video Kenangan Prewedding
          </span>
          <div className="p-2 rounded-2xl backdrop-blur-md bg-white/50 border border-white/80">
            <VideoPlayer url={couple.videoUrl} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MomentSlab
