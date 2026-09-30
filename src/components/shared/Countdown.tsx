'use client'

import React, { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date | string
  className?: string
  variant?: 'card' | 'clean'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  className = '',
  variant = 'card',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      }
    }

    setTimeLeft(calculateTime())
    const timer = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: 'Hari', value: timeLeft?.days ?? 0 },
    { label: 'Jam', value: timeLeft?.hours ?? 0 },
    { label: 'Menit', value: timeLeft?.minutes ?? 0 },
    { label: 'Detik', value: timeLeft?.seconds ?? 0 },
  ]

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="grid grid-cols-4 gap-2 text-center">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center ${
              variant === 'clean'
                ? 'py-1 px-1 bg-transparent'
                : 'p-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#E2D9CE] shadow-sm'
            }`}
          >
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#1B2A4A] tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-wider text-[#8C7851] mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Countdown
