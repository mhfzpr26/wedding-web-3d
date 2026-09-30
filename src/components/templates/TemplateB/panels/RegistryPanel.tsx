'use client'

import { Check, Copy, CreditCard, QrCode, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import type { BankAccount } from '@/types'

interface RegistryPanelProps {
  bankAccounts: BankAccount[]
}

export const RegistryPanel: React.FC<RegistryPanelProps> = ({ bankAccounts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedQrisAccount, setSelectedQrisAccount] = useState<BankAccount | null>(null)

  const handleCopy = async (account: BankAccount) => {
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopiedId(account.id)
      toast('ACCOUNT COPIED', {
        description: `Nomor rekening ${account.bankName} berhasil disalin ke clipboard.`,
        className: 'bg-neutral-950 text-white font-mono border border-neutral-800',
      })
      setTimeout(() => {
        setCopiedId(null)
      }, 2500)
    } catch {
      toast.error('Gagal menyalin nomor rekening')
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto overscroll-contain select-none scrollbar-none">
      {/* 1. Masthead */}
      <div className="border-b border-neutral-900 pb-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-950">
          INDEX // 03 &bull; THE REGISTRY
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
          DIGITAL TOKENS
        </span>
      </div>

      {/* 2. Body Content */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 block mb-1">
            CONTRIBUTIONS &amp; WISHES
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight text-neutral-950 uppercase">
            Wedding Registry
          </h2>
          <p className="font-sans text-xs text-neutral-600 mt-2 max-w-lg leading-relaxed">
            Your presence and prayers are our greatest honor. Should you wish to send a token of
            congratulations, you may do so through our official accounts below:
          </p>
        </div>

        {/* Bank Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map((account) => {
            const isCopied = copiedId === account.id

            return (
              <div
                key={account.id}
                className="border border-neutral-950 p-5 bg-white space-y-4 shadow-xs relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-none bg-neutral-950 flex items-center justify-center text-white">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-950 uppercase tracking-wider">
                      {account.bankName}
                    </span>
                  </div>

                  {account.qrisImageUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedQrisAccount(account)}
                      className="inline-flex items-center space-x-1 font-mono text-[10px] uppercase tracking-wider text-neutral-950 border border-neutral-950 px-2 py-0.5 hover:bg-neutral-950 hover:text-white transition-colors"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>QRIS</span>
                    </button>
                  )}
                </div>

                {/* Account Details */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    ACCOUNT NUMBER:
                  </p>
                  <p className="font-mono text-xl font-bold tracking-widest text-neutral-950 mt-0.5 select-all">
                    {account.accountNumber}
                  </p>
                  <p className="font-mono text-xs text-neutral-600 mt-1">
                    BENEFICIARY:{' '}
                    <span className="text-neutral-950 font-bold uppercase">
                      {account.accountHolder}
                    </span>
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(account)}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors active:scale-[0.99]"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY ACCOUNT</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Bottom Guide */}
      <div className="border-t border-neutral-900/15 pt-3 flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          &larr; TIMELINE
        </span>
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          SWIPE FOR RSVP &amp; WISHES &rarr;
        </span>
      </div>

      {/* QRIS Modal */}
      {selectedQrisAccount && selectedQrisAccount.qrisImageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedQrisAccount(null)}
        >
          <div
            className="relative max-w-xs w-full bg-white border-2 border-neutral-950 p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQrisAccount(null)}
              aria-label="Tutup"
              className="absolute top-3 right-3 w-7 h-7 border border-neutral-950 flex items-center justify-center text-neutral-950 hover:bg-neutral-950 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 block mb-1">
              DIGITAL QRIS CODE
            </span>
            <h3 className="font-serif text-lg font-light text-neutral-950 uppercase">
              {selectedQrisAccount.bankName}
            </h3>
            <p className="font-mono text-[10px] text-neutral-600 mt-0.5 uppercase">
              A.N {selectedQrisAccount.accountHolder}
            </p>

            <div className="mt-4 p-2 bg-white border border-neutral-950 flex justify-center">
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

            <p className="font-mono text-[9px] uppercase text-neutral-400 mt-3">
              Scan with mobile banking or e-wallet application
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegistryPanel
