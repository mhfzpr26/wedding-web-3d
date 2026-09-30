'use client'

import {
  Check,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Music,
  Palette,
  Save,
  Sparkles,
  User,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { updateCoupleSettings } from '@/actions/admin'
import type { Couple, TemplateType } from '@/types'

interface CoupleSettingsClientProps {
  couple: Couple
}

export const CoupleSettingsClient: React.FC<CoupleSettingsClientProps> = ({ couple }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(couple.selectedTemplate)
  const [groomName, setGroomName] = useState(couple.groomName)
  const [brideName, setBrideName] = useState(couple.brideName)
  const [groomParents, setGroomParents] = useState(couple.groomParents || '')
  const [brideParents, setBrideParents] = useState(couple.brideParents || '')

  // Photoless toggle
  const initialIsPhotoless = !couple.coverPhotoUrl && !couple.groomPhotoUrl
  const [isPhotolessMode, setIsPhotolessMode] = useState(initialIsPhotoless)

  // Media URLs
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(couple.coverPhotoUrl || '')
  const [groomPhotoUrl, setGroomPhotoUrl] = useState(couple.groomPhotoUrl || '')
  const [bridePhotoUrl, setBridePhotoUrl] = useState(couple.bridePhotoUrl || '')
  const [closingPhotoUrl, setClosingPhotoUrl] = useState(couple.closingPhotoUrl || '')
  const [videoUrl, setVideoUrl] = useState(couple.videoUrl || '')
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState(couple.backgroundMusicUrl || '')

  // Text & Quotes
  const [openingQuoteTitle, setOpeningQuoteTitle] = useState(couple.openingQuoteTitle || '')
  const [openingQuoteText, setOpeningQuoteText] = useState(couple.openingQuoteText || '')
  const [closingMessage, setClosingMessage] = useState(couple.closingMessage || '')
  const [dressCodeDesc, setDressCodeDesc] = useState(couple.dressCodeDesc || '')

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await updateCoupleSettings({
        coupleId: couple.id,
        selectedTemplate,
        groomName,
        brideName,
        groomParents,
        brideParents,
        coverPhotoUrl,
        groomPhotoUrl,
        bridePhotoUrl,
        closingPhotoUrl,
        videoUrl,
        backgroundMusicUrl,
        openingQuoteTitle,
        openingQuoteText,
        closingMessage,
        dressCodeDesc,
        isPhotolessMode,
      })

      if (res.success) {
        toast.success(res.message || 'Pengaturan berhasil disimpan!')
      } else {
        toast.error(res.message || 'Gagal menyimpan pengaturan')
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  const templates = [
    {
      id: 'TEMPLATE_A' as TemplateType,
      title: 'Template A',
      subtitle: 'Soft Arch & Botanical',
      badge: 'Ivory & Gold',
      desc: 'Kartu kubah berkontur lengkung, warna hangat, ornamen botanical klasik.',
    },
    {
      id: 'TEMPLATE_B' as TemplateType,
      title: 'Template B',
      subtitle: 'Contemporary Editorial',
      badge: 'Monochrome',
      desc: 'Layout majalah haute couture, kontras tegas, grid asimetris minimalis.',
    },
    {
      id: 'TEMPLATE_C' as TemplateType,
      title: 'Template C',
      subtitle: 'Frosted Glass & Muted',
      badge: 'Glassmorphism',
      desc: 'Efek kaca es transparan berbayang, palet sage green, sentuhan modern pastel.',
    },
  ]

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Pengaturan Tema &amp; Konten Undangan
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Ganti template visual secara instan dan perbarui konten pernikahan
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/invitation/${couple.slug}`}
            target="_blank"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-neutral-300 hover:bg-neutral-50 transition-colors text-neutral-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851]" />
            <span>Lihat Hasil Live</span>
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#1B2A4A] text-white shadow-sm hover:bg-[#15223c] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* 1. Template Selector */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 font-serif font-bold text-base">
          <Palette className="w-4 h-4 text-[#8C7851]" />
          <h2>Pilihan Desain Template</h2>
        </div>
        <p className="text-xs text-neutral-500">
          Ubah gaya visual undangan. Data konten akan otomatis diadaptasikan tanpa perlu input
          ulang.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {templates.map((t) => {
            const isSelected = selectedTemplate === t.id

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-[#1B2A4A] bg-[#FAF8F5] ring-2 ring-[#1B2A4A]/20 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-sm text-neutral-900">{t.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#8C7851]">{t.subtitle}</p>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">{t.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Photoless Mode Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
        <div className="space-y-1 pr-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-sm text-neutral-900">
              Mode Privasi / Tanpa Foto (Photoless Mode)
            </h3>
          </div>
          <p className="text-xs text-neutral-500 max-w-lg">
            Aktifkan jika pengantin memilih untuk tidak memajang foto/video wajah. Undangan akan
            otomatis beralih menampilkan monogram inisial emas dan tipografi editorial yang elegan.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isPhotolessMode}
            onChange={(e) => setIsPhotolessMode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2A4A]" />
        </label>
      </div>

      {/* 3. Mempelai & Profil */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 font-serif font-bold text-base">
          <User className="w-4 h-4 text-[#8C7851]" />
          <h2>Data Mempelai</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Mempelai Pria &amp; Gelar
            </label>
            <input
              type="text"
              required
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Mempelai Wanita &amp; Gelar
            </label>
            <input
              type="text"
              required
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Keterangan Orang Tua Pria
            </label>
            <input
              type="text"
              value={groomParents}
              onChange={(e) => setGroomParents(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Keterangan Orang Tua Wanita
            </label>
            <input
              type="text"
              value={brideParents}
              onChange={(e) => setBrideParents(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Media & Tautan Audio/Video */}
      {!isPhotolessMode && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-neutral-900 font-serif font-bold text-base">
            <ImageIcon className="w-4 h-4 text-[#8C7851]" />
            <h2>Foto &amp; Media Visual</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Foto Sampul (Cover Hero)
              </label>
              <input
                type="text"
                value={coverPhotoUrl}
                onChange={(e) => setCoverPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Foto Penutup (Closing)
              </label>
              <input
                type="text"
                value={closingPhotoUrl}
                onChange={(e) => setClosingPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Foto Mempelai Pria
              </label>
              <input
                type="text"
                value={groomPhotoUrl}
                onChange={(e) => setGroomPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Foto Mempelai Wanita
              </label>
              <input
                type="text"
                value={bridePhotoUrl}
                onChange={(e) => setBridePhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Video Prewedding (Embed YouTube / MP4 Direct)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 block mt-1">
                Kosongkan kolom ini jika tidak ingin menampilkan seksi video.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Teks Narasi & Doa */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 font-serif font-bold text-base">
          <Heart className="w-4 h-4 text-[#8C7851]" />
          <h2>Teks Narasi &amp; Kutipan</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Judul Ayat / Kutipan
              </label>
              <input
                type="text"
                value={openingQuoteTitle}
                onChange={(e) => setOpeningQuoteTitle(e.target.value)}
                placeholder="Contoh: Ar-Rum: 21"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Ketentuan Dress Code
              </label>
              <input
                type="text"
                value={dressCodeDesc}
                onChange={(e) => setDressCodeDesc(e.target.value)}
                placeholder="Formal &amp; Batik Modern (Earth Tone / Champagne Gold)"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Isi Teks Doa / Kutipan Pembuka
            </label>
            <textarea
              rows={3}
              value={openingQuoteText}
              onChange={(e) => setOpeningQuoteText(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Pesan Penutup &amp; Terima Kasih
            </label>
            <textarea
              rows={3}
              value={closingMessage}
              onChange={(e) => setClosingMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save action floating bottom bar */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#1B2A4A] text-white shadow-md hover:bg-[#15223c] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}</span>
        </button>
      </div>
    </form>
  )
}

export default CoupleSettingsClient
