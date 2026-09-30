'use client'

import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  Search,
  Send,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { createBatchGuests, createGuest, deleteGuest } from '@/actions/guests'
import type { Guest } from '@/types'

interface GuestManagerClientProps {
  initialGuests: Guest[]
  coupleId: string
  coupleSlug: string
  groomName: string
  brideName: string
}

export const GuestManagerClient: React.FC<GuestManagerClientProps> = ({
  initialGuests,
  coupleId,
  coupleSlug,
  groomName,
  brideName,
}) => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single')

  // Form states
  const [singleName, setSingleName] = useState('')
  const [singlePhone, setSinglePhone] = useState('')
  const [batchNames, setBatchNames] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInvitationUrl = (guestName: string) => {
    return `${origin}/invitation/${coupleSlug}?to=${encodeURIComponent(guestName)}`
  }

  const handleCopyLink = async (guest: Guest) => {
    const url = getInvitationUrl(guest.name)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(guest.id)
      toast.success(`Tautan undangan untuk "${guest.name}" berhasil disalin!`)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      toast.error('Gagal menyalin tautan')
    }
  }

  const handleSendWhatsApp = (guest: Guest) => {
    const url = getInvitationUrl(guest.name)
    const groomShort = groomName.split(',')[0]
    const brideShort = brideName.split(',')[0]

    const text = `Kepada Yth. Bapak/Ibu/Saudara/i ${guest.name},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*The Wedding of ${groomShort} & ${brideShort}*

Silakan buka tautan undangan digital Anda di bawah ini:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu. Terima kasih. 🙏`

    const phone = guest.phoneNumber
      ? guest.phoneNumber.replace(/^0/, '62').replace(/[^0-9]/g, '')
      : ''
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`

    window.open(waUrl, '_blank')
  }

  const handleDelete = async (guest: Guest) => {
    if (!confirm(`Hapus tamu "${guest.name}"?`)) return

    try {
      const res = await deleteGuest(guest.id)
      if (res.success) {
        setGuests(guests.filter((g) => g.id !== guest.id))
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error('Gagal menghapus data tamu')
    }
  }

  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!singleName.trim()) {
      toast.error('Nama tamu wajib diisi')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createGuest({
        coupleId,
        name: singleName,
        phoneNumber: singlePhone,
      })

      if (res.success && res.data) {
        setGuests([res.data, ...guests])
        setSingleName('')
        setSinglePhone('')
        setIsAddModalOpen(false)
        toast.success(res.message)
      } else {
        toast.error(res.message || 'Gagal menambahkan tamu')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    const names = batchNames
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean)
    if (names.length === 0) {
      toast.error('Masukkan minimal 1 nama tamu')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createBatchGuests({
        coupleId,
        names,
      })

      if (res.success) {
        // Refresh local list
        setBatchNames('')
        setIsAddModalOpen(false)
        toast.success(res.message)
        window.location.reload()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Manajemen Tamu Undangan
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola daftar undangan, personalisasi tautan, dan kirim pesan via WhatsApp
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1B2A4A] text-white shadow-sm hover:bg-[#15223c] active:scale-[0.99] transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-[#D4AF37]" />
          <span>Tambah Tamu Baru</span>
        </button>
      </div>

      {/* Search and Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama tamu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          />
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-neutral-500">
          <span>
            Total: <strong className="text-neutral-900">{guests.length}</strong>
          </span>
          <span>
            Ditemukan: <strong className="text-neutral-900">{filteredGuests.length}</strong>
          </span>
        </div>
      </div>

      {/* Table of Guests */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200/80 font-mono text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Tamu</th>
                <th className="px-5 py-3.5">Status Undangan</th>
                <th className="px-5 py-3.5">RSVP</th>
                <th className="px-5 py-3.5">Jumlah</th>
                <th className="px-5 py-3.5 text-right">Aksi &amp; Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
                    Tidak ada data tamu yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isCopied = copiedId === guest.id

                  return (
                    <tr key={guest.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Name & Phone */}
                      <td className="px-5 py-4 font-medium text-neutral-900">
                        <div className="font-semibold text-sm">{guest.name}</div>
                        {guest.phoneNumber && (
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {guest.phoneNumber}
                          </div>
                        )}
                      </td>

                      {/* Is Opened */}
                      <td className="px-5 py-4">
                        {guest.isOpened ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Sudah Dibuka</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
                            <Clock className="w-3 h-3" />
                            <span>Belum Dibuka</span>
                          </span>
                        )}
                      </td>

                      {/* RSVP Status */}
                      <td className="px-5 py-4">
                        {guest.statusRsvp === 'ATTENDING' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Hadir</span>
                          </span>
                        )}
                        {guest.statusRsvp === 'PENDING' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <HelpCircle className="w-3 h-3" />
                            <span>Ragu / Pending</span>
                          </span>
                        )}
                        {guest.statusRsvp === 'DECLINED' && (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Tidak Hadir</span>
                          </span>
                        )}
                      </td>

                      {/* Attendees Count */}
                      <td className="px-5 py-4 font-mono font-medium text-neutral-800">
                        {guest.statusRsvp === 'ATTENDING' ? `${guest.attendeesCount} Orang` : '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopyLink(guest)}
                            title="Salin Tautan Undangan"
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[11px] text-emerald-600 font-medium">
                                  Tersalin
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-[11px]">Salin</span>
                              </>
                            )}
                          </button>

                          {/* Send WhatsApp Button */}
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            title="Kirim Undangan via WhatsApp"
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Preview Link */}
                          <a
                            href={getInvitationUrl(guest.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat Sebagai Tamu Ini"
                            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(guest)}
                            title="Hapus Tamu"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Guest */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Tambah Tamu Undangan
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-neutral-100 text-xs font-medium">
              <button
                onClick={() => setActiveTab('single')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'single'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Satu per Satu
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'batch'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Massal (Banyak Sekaligus)
              </button>
            </div>

            {/* Single Form */}
            {activeTab === 'single' ? (
              <form onSubmit={handleAddSingle} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Nama Tamu
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Hartono &amp; Keluarga"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#1B2A4A] text-white font-semibold text-xs hover:bg-[#15223c] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Tamu'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Batch Form */
              <form onSubmit={handleAddBatch} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Daftar Nama (Satu Nama per Baris)
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Budi Santoso&#10;dr. Anindya Putri&#10;Rian &amp; Keluarga"
                    value={batchNames}
                    onChange={(e) => setBatchNames(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                  <span className="text-[11px] text-neutral-400 block mt-1">
                    Setiap baris baru akan disimpan sebagai satu tamu terpisah.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#1B2A4A] text-white font-semibold text-xs hover:bg-[#15223c] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Memproses...' : 'Simpan Semua Tamu'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestManagerClient
