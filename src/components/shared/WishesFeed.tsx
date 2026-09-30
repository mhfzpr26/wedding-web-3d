'use client'

import React, { useState } from 'react'
import type { Wish, Guest } from '@/types'
import { MessageSquareHeart, Send, User, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

import { submitWish } from '@/actions/wishes'

interface WishesFeedProps {
  initialWishes: Wish[]
  guest?: Guest | null
  coupleId: string
  slug?: string
  className?: string
}

export const WishesFeed: React.FC<WishesFeedProps> = ({
  initialWishes,
  guest,
  coupleId,
  slug,
  className = '',
}) => {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  const [senderName, setSenderName] = useState(guest?.name || '')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLocked = Boolean(guest?.name)

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!senderName.trim()) {
      toast.error('Silakan isi nama pengirim')
      return
    }

    if (!message.trim()) {
      toast.error('Silakan tulis doa atau ucapan Anda')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitWish({
        coupleId,
        guestId: guest?.id || null,
        senderName: senderName.trim(),
        message: message.trim(),
        slug,
      })

      if (res.success && res.data) {
        setWishes([res.data, ...wishes])
        setMessage('')
        toast.success(res.message || 'Doa & ucapan Anda berhasil dikirim!')
      } else {
        toast.error(res.message || 'Gagal mengirim ucapan')
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim ucapan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Form Kirim Doa */}
      <div className="bg-white/90 backdrop-blur-sm border border-[#E2D9CE] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquareHeart className="w-5 h-5 text-[#8C7851]" />
          <h4 className="font-serif text-lg font-bold text-[#1B2A4A]">
            Kirim Doa &amp; Ucapan
          </h4>
        </div>

        <form onSubmit={handleSubmitWish} className="space-y-3.5">
          <div>
            <input
              type="text"
              value={senderName}
              readOnly={isLocked}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Nama Anda"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                isLocked
                  ? 'bg-[#FAF8F5] border-[#E2D9CE] text-[#1B2A4A] cursor-not-allowed font-medium'
                  : 'bg-white border-[#E2D9CE] text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50'
              }`}
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2D9CE] bg-white text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#8C7851] text-white shadow-sm hover:bg-[#7a6743] active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4 text-[#F4F1EA]" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}</span>
          </button>
        </form>
      </div>

      {/* Feed Ucapan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#8A7968]">
            Ucapan Doa ({wishes.length})
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-[#E2D9CE]">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E2D9CE] shadow-xs space-y-2 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 text-[#8C7851] text-xs font-bold font-serif flex items-center justify-center">
                    {getInitials(wish.senderName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-serif text-[#1B2A4A]">
                      {wish.senderName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-[10px] text-[#A09383]">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {formatDate(wish.createdAt, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#556270] leading-relaxed pl-10 font-sans">
                {wish.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishesFeed
