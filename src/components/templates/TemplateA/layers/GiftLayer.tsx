'use client'

import React, { useState } from 'react'
import type { BankAccount } from '@/types'
import { Sparkles, Copy, Check, QrCode, X, Gift } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface GiftLayerProps {
  bankAccounts: BankAccount[]
}

export const GiftLayer: React.FC<GiftLayerProps> = ({ bankAccounts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeAccountIndex, setActiveAccountIndex] = useState(0)
  const [selectedQrisAccount, setSelectedQrisAccount] = useState<BankAccount | null>(null)

  const accounts = bankAccounts || []
  const activeAccount = accounts[activeAccountIndex] || accounts[0]

  const handleCopy = async (account: BankAccount) => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopiedId(account.id)
      toast.success(`Nomor rekening ${account.bankName} berhasil disalin!`)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      toast.error('Gagal menyalin nomor rekening')
    }
  }

  return (
    <div className="w-full p-3 sm:p-5 text-center select-text relative">

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-2 select-none">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#8C7851] uppercase bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CE]/80 shadow-sm inline-flex items-center space-x-1">
          <Gift className="w-3 h-3 text-[#D4AF37]" />
          <span>Gift Stationery Pouch</span>
        </span>
        <div className="flex items-center space-x-1 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-0.5 mb-2.5">
        <h2 className="text-xl sm:text-2xl font-serif text-[#1B2A4A]">Tanda Kasih</h2>
        <p className="text-[10px] sm:text-[11px] text-[#8A7968] max-w-xs mx-auto leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin berbagi tanda kasih, dapat melalui:
        </p>
      </div>

      {/* Account Switcher Pills if multiple */}
      {accounts.length > 1 && (
        <div className="flex justify-center space-x-2 mb-2">
          {accounts.map((acc, idx) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => setActiveAccountIndex(idx)}
              className={`px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                activeAccountIndex === idx
                  ? 'bg-[#1B2A4A] text-[#FAF8F5] shadow-sm font-bold'
                  : 'bg-white/75 text-[#8C7851] border border-[#E2D9CE] hover:bg-white'
              }`}
            >
              {acc.bankName}
            </button>
          ))}
        </div>
      )}

      {/* Active Bank Account Details */}
      {activeAccount && (
        <div className="p-3 sm:p-4 text-left max-w-xs sm:max-w-sm mx-auto w-full space-y-2">
          {/* Card Top Row: EMV Chip & Bank Name */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              {/* Metallic Gold EMV Chip Graphic */}
              <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#FFF2C2] to-[#B38C26] border border-[#B38C26]/60 shadow-sm relative flex items-center justify-center">
                <div className="w-5 h-3 border-x border-[#B38C26]/40" />
              </div>

              <span className="font-serif font-bold text-base sm:text-lg text-[#1B2A4A]">
                {activeAccount.bankName}
              </span>
            </div>

            {activeAccount.qrisImageUrl && (
              <button
                type="button"
                onClick={() => setSelectedQrisAccount(activeAccount)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E2D9CE] text-[10px] font-mono text-[#8C7851] hover:bg-white transition-colors cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>QRIS</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-mono uppercase tracking-wider text-[#8A7968]">
              Nomor Rekening
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-base sm:text-lg font-bold text-[#1B2A4A] tracking-wider select-all">
                {activeAccount.accountNumber}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(activeAccount)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E2D9CE] hover:bg-[#1B2A4A] hover:text-white transition-all text-xs font-serif text-[#1B2A4A] cursor-pointer shadow-sm"
              >
                {copiedId === activeAccount.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C7851]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2D9CE]/60 flex items-center justify-between text-[11px] text-[#556270]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A7968]">
              Atas Nama
            </span>
            <span className="font-serif font-bold text-[#1B2A4A]">
              {activeAccount.accountHolder}
            </span>
          </div>
        </div>
      )}

      {/* QRIS Modal Overlay */}
      {selectedQrisAccount?.qrisImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E2D9CE] shadow-2xl space-y-3 relative text-center">
            <button
              type="button"
              onClick={() => setSelectedQrisAccount(null)}
              className="absolute top-3 right-3 p-1 rounded-full text-[#8A7968] hover:bg-[#FAF8F5]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif font-bold text-base text-[#1B2A4A]">
              QRIS {selectedQrisAccount.bankName}
            </h3>
            <p className="text-[10px] font-serif text-[#8A7968]">
              Scan untuk kemudahan transfer tanda kasih
            </p>

            <div className="relative w-52 h-52 mx-auto rounded-xl overflow-hidden border border-[#E2D9CE]">
              <Image
                src={selectedQrisAccount.qrisImageUrl}
                alt="QRIS"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <p className="text-xs font-mono font-bold text-[#1B2A4A]">
              a.n. {selectedQrisAccount.accountHolder}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftLayer
