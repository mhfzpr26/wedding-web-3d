'use client'

import React, { useState } from 'react'
import type { BankAccount } from '@/types'
import { Copy, Check, QrCode, X, CreditCard, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface GiftVaultSlabProps {
  bankAccounts: BankAccount[]
}

export const GiftVaultSlab: React.FC<GiftVaultSlabProps> = ({ bankAccounts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedQrisAccount, setSelectedQrisAccount] = useState<BankAccount | null>(null)

  const handleCopy = async (account: BankAccount) => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopiedId(account.id)
      toast.success(`Nomor rekening ${account.bankName} berhasil disalin!`, {
        className: 'backdrop-blur-md bg-white/80 text-teal-900 border border-teal-200 shadow-lg font-sans',
      })
      setTimeout(() => {
        setCopiedId(null)
      }, 2500)
    } catch {
      toast.error('Gagal menyalin nomor rekening')
    }
  }

  return (
    <div className="w-full rounded-3xl backdrop-blur-xl bg-white/70 border border-white/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient Glare */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-teal-200/30 via-emerald-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Slab Indicator Tag */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <span className="text-[10px] font-mono tracking-widest text-teal-800 uppercase backdrop-blur-md bg-white/60 px-3 py-1 rounded-full border border-white/70 shadow-2xs">
          Slab 03 &bull; The Gift Vault
        </span>
        <div className="flex items-center space-x-1 text-teal-600">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center relative z-10 space-y-1 mt-2">
        <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-teal-800 backdrop-blur-md bg-white/60 px-3 py-0.5 rounded-full border border-white/70">
          Tanda Kasih
        </span>
        <h2 className="text-2xl font-serif text-slate-900">Amplop Akrilik</h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat menyampaikannya di bawah ini:
        </p>
      </div>

      {/* Bank Cards Grid */}
      <div className="mt-6 space-y-4 relative z-10">
        {bankAccounts.map((account) => {
          const isCopied = copiedId === account.id

          return (
            <div
              key={account.id}
              className="p-5 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 shadow-xs space-y-3 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-serif font-semibold text-base text-slate-900">
                    {account.bankName}
                  </span>
                </div>

                {account.qrisImageUrl && (
                  <button
                    type="button"
                    onClick={() => setSelectedQrisAccount(account)}
                    className="inline-flex items-center space-x-1 text-xs px-3 py-1 rounded-full backdrop-blur-md bg-teal-50 text-teal-800 border border-teal-200/70 hover:bg-teal-100 transition-colors"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Lihat QRIS</span>
                  </button>
                )}
              </div>

              {/* Account Details */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Nomor Rekening:
                </p>
                <p className="font-mono text-lg font-bold tracking-wider text-slate-900 mt-0.5 select-all">
                  {account.accountNumber}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  a.n <span className="font-medium text-slate-900">{account.accountHolder}</span>
                </p>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(account)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-medium backdrop-blur-md bg-teal-800 text-white hover:bg-teal-900 transition-colors shadow-xs active:scale-[0.99]"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* QRIS Modal */}
      {selectedQrisAccount && selectedQrisAccount.qrisImageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedQrisAccount(null)}
        >
          <div
            className="relative max-w-xs w-full rounded-3xl backdrop-blur-xl bg-white/95 border-2 border-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQrisAccount(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <h3 className="font-serif text-lg font-semibold text-slate-900">
              QRIS {selectedQrisAccount.bankName}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              a.n {selectedQrisAccount.accountHolder}
            </p>

            <div className="mt-4 p-2 bg-white rounded-2xl border border-slate-200 flex justify-center">
              <div className="relative w-52 h-52">
                <Image
                  src={selectedQrisAccount.qrisImageUrl}
                  alt={`QRIS ${selectedQrisAccount.bankName}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Pindai kode QR menggunakan aplikasi mobile banking atau e-wallet pilihan Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftVaultSlab
