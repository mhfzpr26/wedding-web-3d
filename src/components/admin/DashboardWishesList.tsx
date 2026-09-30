'use client'

import React, { useState } from 'react'
import type { Wish } from '@/types'
import { Trash2, MessageSquare, Clock } from 'lucide-react'
import { deleteWish } from '@/actions/wishes'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface DashboardWishesListProps {
  initialWishes: Wish[]
  coupleSlug: string
}

export const DashboardWishesList: React.FC<DashboardWishesListProps> = ({
  initialWishes,
  coupleSlug,
}) => {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (wishId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return

    setDeletingId(wishId)
    try {
      const res = await deleteWish(wishId, coupleSlug)
      if (res.success) {
        setWishes(wishes.filter((w) => w.id !== wishId))
        toast.success('Ucapan berhasil dihapus')
      } else {
        toast.error(res.message || 'Gagal menghapus ucapan')
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus')
    } finally {
      setDeletingId(null)
    }
  }

  if (wishes.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-400 font-sans text-xs">
        Belum ada doa dan ucapan yang masuk.
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="p-4 flex items-start justify-between hover:bg-neutral-50/80 transition-colors"
        >
          <div className="space-y-1 pr-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-neutral-900">
                {wish.senderName}
              </span>
              <span className="text-[11px] text-neutral-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(wish.createdAt, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {wish.message}
            </p>
          </div>

          <button
            onClick={() => handleDelete(wish.id)}
            disabled={deletingId === wish.id}
            title="Hapus Ucapan"
            className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default DashboardWishesList
