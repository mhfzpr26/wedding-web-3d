'use client'

import { CheckCircle2, HelpCircle, Lock, Send, Users, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { submitRsvp } from '@/actions/rsvp'
import type { Guest, RsvpStatus } from '@/types'

interface RsvpFormProps {
  coupleId: string
  guest?: Guest | null
  slug?: string
  onSubmit?: (data: {
    guestId?: string
    name: string
    statusRsvp: RsvpStatus
    attendeesCount: number
  }) => Promise<void> | void
  className?: string
  variant?: 'card' | 'clean'
}

export const RsvpForm: React.FC<RsvpFormProps> = ({
  coupleId,
  guest,
  slug,
  onSubmit,
  className = '',
  variant = 'card',
}) => {
  const [name, setName] = useState(guest?.name || '')
  const [statusRsvp, setStatusRsvp] = useState<RsvpStatus>(guest?.statusRsvp || 'ATTENDING')
  const [attendeesCount, setAttendeesCount] = useState<number>(guest?.attendeesCount || 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isLocked = Boolean(guest?.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Silakan isi nama Anda')
      return
    }

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit({
          guestId: guest?.id,
          name,
          statusRsvp,
          attendeesCount: statusRsvp === 'ATTENDING' ? attendeesCount : 0,
        })
      }

      const res = await submitRsvp({
        coupleId,
        guestId: guest?.id,
        status: statusRsvp,
        attendeesCount: statusRsvp === 'ATTENDING' ? attendeesCount : 0,
        name,
        slug,
      })

      if (res.success) {
        setSubmitted(true)
        toast.success(res.message || 'Konfirmasi kehadiran berhasil disimpan!')
      } else {
        toast.error(res.message || 'Gagal menyimpan konfirmasi')
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim RSVP')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`w-full ${
        variant === 'clean'
          ? 'bg-transparent border-0 p-0 shadow-none'
          : 'bg-white/90 backdrop-blur-sm border border-[#E2D9CE] rounded-3xl p-6 shadow-sm'
      } ${className}`}
    >
      {submitted ? (
        <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#1B2A4A]">Terima Kasih!</h4>
          <p className="text-xs text-[#8A7968] max-w-xs mx-auto">
            Konfirmasi kehadiran atas nama{' '}
            <span className="font-medium text-[#1B2A4A]">{name}</span> telah tersimpan.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#8C7851] underline pt-2 hover:text-[#1B2A4A]"
          >
            Ubah Tanggapan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Tamu */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="guest-name"
                className="text-xs font-serif font-semibold text-[#1B2A4A]"
              >
                Nama Tamu
              </label>
              {isLocked && (
                <span className="flex items-center space-x-1 text-[10px] text-[#8C7851] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E2D9CE]">
                  <Lock className="w-3 h-3" />
                  <span>Identitas Terkunci</span>
                </span>
              )}
            </div>
            <input
              id="guest-name"
              type="text"
              value={name}
              readOnly={isLocked}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                isLocked
                  ? 'bg-[#FAF8F5] border-[#E2D9CE] text-[#1B2A4A] cursor-not-allowed font-medium'
                  : 'bg-white border-[#E2D9CE] text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50'
              }`}
            />
          </div>

          {/* Konfirmasi Kehadiran */}
          <div>
            <label className="block text-xs font-serif font-semibold text-[#1B2A4A] mb-2">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatusRsvp('ATTENDING')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  statusRsvp === 'ATTENDING'
                    ? 'border-[#8C7851] bg-[#FAF8F5] text-[#1B2A4A] shadow-sm ring-1 ring-[#8C7851]'
                    : 'border-[#E2D9CE] bg-white text-[#8A7968] hover:bg-neutral-50'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 mb-1 ${
                    statusRsvp === 'ATTENDING' ? 'text-[#8C7851]' : 'text-neutral-400'
                  }`}
                />
                <span>Hadir</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusRsvp('PENDING')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  statusRsvp === 'PENDING'
                    ? 'border-[#8C7851] bg-[#FAF8F5] text-[#1B2A4A] shadow-sm ring-1 ring-[#8C7851]'
                    : 'border-[#E2D9CE] bg-white text-[#8A7968] hover:bg-neutral-50'
                }`}
              >
                <HelpCircle
                  className={`w-5 h-5 mb-1 ${
                    statusRsvp === 'PENDING' ? 'text-[#8C7851]' : 'text-neutral-400'
                  }`}
                />
                <span>Masih Ragu</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusRsvp('DECLINED')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  statusRsvp === 'DECLINED'
                    ? 'border-[#8C7851] bg-[#FAF8F5] text-[#1B2A4A] shadow-sm ring-1 ring-[#8C7851]'
                    : 'border-[#E2D9CE] bg-white text-[#8A7968] hover:bg-neutral-50'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 mb-1 ${
                    statusRsvp === 'DECLINED' ? 'text-[#8C7851]' : 'text-neutral-400'
                  }`}
                />
                <span>Tidak Hadir</span>
              </button>
            </div>
          </div>

          {/* Jumlah Tamu (jika Hadir) */}
          {statusRsvp === 'ATTENDING' && (
            <div className="animate-in fade-in duration-200">
              <label
                htmlFor="attendees-count"
                className="block text-xs font-serif font-semibold text-[#1B2A4A] mb-1.5"
              >
                Jumlah Hadir
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-3 text-[#8A7968]" />
                <select
                  id="attendees-count"
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D9CE] bg-white text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                </select>
              </div>
            </div>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[#1B2A4A] text-[#F4F1EA] shadow-md hover:bg-[#15223c] active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <span>{isSubmitting ? 'Mengirim Konfirmasi...' : 'Kirim Konfirmasi'}</span>
          </button>
        </form>
      )}
    </div>
  )
}

export default RsvpForm
