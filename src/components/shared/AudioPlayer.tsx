'use client'

import { VolumeX } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  src?: string | null
  isPlaying: boolean
  onToggle: () => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [hasError, setHasError] = React.useState(false)

  useEffect(() => {
    if (!audioRef.current || !src || hasError) return

    let fadeInterval: NodeJS.Timeout | null = null

    if (isPlaying) {
      audioRef.current.volume = 0
      audioRef.current
        .play()
        .then(() => {
          let currentVol = 0
          fadeInterval = setInterval(() => {
            if (!audioRef.current) return
            currentVol = Math.min(0.8, currentVol + 0.05)
            audioRef.current.volume = currentVol
            if (currentVol >= 0.8 && fadeInterval) {
              clearInterval(fadeInterval)
            }
          }, 80)
        })
        .catch(() => {
          // Autoplay was blocked by browser policy or audio failed to load
        })
    } else {
      audioRef.current.pause()
    }

    return () => {
      if (fadeInterval) clearInterval(fadeInterval)
    }
  }, [isPlaying, src, hasError])

  if (!src || hasError) return null

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" onError={() => setHasError(true)} />
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1B2A4A]/90 text-[#F4F1EA] shadow-xl backdrop-blur-md border border-[#D4AF37]/50 hover:bg-[#1B2A4A] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Animated pulse ring when playing */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-ping opacity-30" />
          )}

          {isPlaying ? (
            <div className="flex items-center space-x-0.5">
              <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-bounce" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-[#F4F1EA]/70 group-hover:text-[#F4F1EA]" />
          )}
        </button>
      </div>
    </>
  )
}

export default AudioPlayer
