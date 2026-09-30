'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface RunwayProgressProps {
  currentIndex: number
  totalPanels: number
  onNavigate: (index: number) => void
}

export const RunwayProgress: React.FC<RunwayProgressProps> = ({
  currentIndex,
  totalPanels,
  onNavigate,
}) => {
  const currentFormatted = String(currentIndex + 1).padStart(2, '0')
  const totalFormatted = String(totalPanels).padStart(2, '0')
  const progressPercent = ((currentIndex + 1) / totalPanels) * 100

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FAFAF8]/95 backdrop-blur-xs border-t border-neutral-900/15 px-6 py-2.5 flex flex-col space-y-1.5 select-none">
      {/* Top 1px hairline progress bar */}
      <div className="w-full h-[1px] bg-neutral-200 overflow-hidden">
        <div
          className="h-full bg-neutral-950 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Navigation Controls & Editorial Index */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between font-mono text-[11px] text-neutral-600">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-neutral-950">{currentFormatted}</span>
          <span>/</span>
          <span className="text-neutral-400">{totalFormatted}</span>
          <span className="hidden sm:inline text-neutral-400 pl-2">&bull; EDITORIAL RUNWAY</span>
        </div>

        {/* Stepper buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            aria-label="Panel Sebelumnya"
            disabled={currentIndex === 0}
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            className="p-1 border border-neutral-300 text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-950 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Quick jump dots */}
          <div className="flex items-center space-x-1 px-1">
            {Array.from({ length: totalPanels }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(idx)}
                aria-label={`Beralih ke panel ${idx + 1}`}
                className={`h-1 transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-4 bg-neutral-950'
                    : 'w-1 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Panel Berikutnya"
            disabled={currentIndex === totalPanels - 1}
            onClick={() => onNavigate(Math.min(totalPanels - 1, currentIndex + 1))}
            className="p-1 border border-neutral-300 text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-950 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RunwayProgress
