'use client'

import React, { useState } from 'react'
import type { BankAccount } from '@/types'
import { Copy, Check, QrCode, X, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface GiftCardProps {
  bankAccounts: BankAccount[]
  className?: string
}

export const GiftCard: React.FC<GiftCardProps> = ({
  bankAccounts,
  className = '',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedQrisAccount, setSelectedQrisAccount] = useState<BankAccount | null>(null)

  const handleCopy = async (account: BankAccount) => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopiedId(account.id)
      toast.success(`Nomor rekening ${account.bankName} berhasil disalin!`)
      setTimeout(() => {
        setCopiedId(null)
      }, 2500)
    } catch {
      toast.error('Gagal menyalin nomor rekening')
    }
  }

  if (!bankAccounts || bankAccounts.length === 0) return null

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {bankAccounts.map((account) => {
        const isCopied = copiedId === account.id

        return (
          <div
            key={account.id}
            className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E2D9CE] shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Top row: Bank icon & name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E2D9CE] flex items-center justify-center text-[#8C7851]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-serif font-bold text-lg text-[#1B2A4A]">
                  {account.bankName}
                </span>
              </div>

              {account.qrisImageUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedQrisAccount(account)}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-[#FAF8F5] text-[#8C7851] border border-[#E2D9CE] hover:bg-[#F4F1EA] transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Lihat QRIS</span>
                </button>
              )}
            </div>

            {/* Account Details */}
            <div className="mt-4">
              <p className="text-xs text-[#8A7968]">Nomor Rekening:</p>
              <p className="font-mono text-xl font-bold tracking-wider text-[#1B2A4A] mt-0.5 select-all">
                {account.accountNumber}
              </p>
              <p className="text-xs text-[#8A7968] mt-1">
                a.n <span className="font-medium text-[#1B2A4A]">{account.accountHolder}</span>
              </p>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={() => handleCopy(account)}
              className="mt-4 w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-medium border border-[#D4AF37]/50 bg-[#FAF8F5] text-[#1B2A4A] hover:bg-[#F4F1EA] active:scale-[0.98] transition-all"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C7851]" />
                  <span>Salin Nomor Rekening</span>
                </>
              )}
            </button>
          </div>
        )
      })}

      {/* QRIS Modal */}
      {selectedQrisAccount && selectedQrisAccount.qrisImageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedQrisAccount(null)}
        >
          <div
            className="relative max-w-xs w-full bg-white rounded-3xl p-6 text-center shadow-2xl border border-[#E2D9CE]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQrisAccount(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
              QRIS {selectedQrisAccount.bankName}
            </h3>
            <p className="text-xs text-[#8A7968] mt-1">
              a.n {selectedQrisAccount.accountHolder}
            </p>

            <div className="mt-4 p-2 bg-white rounded-2xl border border-neutral-200 flex justify-center">
              <div className="relative w-56 h-56">
                <Image
                  src={selectedQrisAccount.qrisImageUrl}
                  alt={`QRIS ${selectedQrisAccount.bankName}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 mt-4">
              Pindai kode QR menggunakan aplikasi mobile banking atau e-wallet pilihan Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftCard
