import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Users,
  CheckCircle,
  HelpCircle,
  XCircle,
  UserCheck,
  MessageSquareHeart,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { DashboardWishesList } from '@/components/admin/DashboardWishesList'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const couple = await prisma.couple.findFirst({
    include: {
      guests: true,
      wishes: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const guests = couple?.guests || []
  const wishes = couple?.wishes || []

  // Metric calculations
  const totalGuests = guests.length
  const openedGuests = guests.filter((g) => g.isOpened).length
  const attendingGuests = guests.filter((g) => g.statusRsvp === 'ATTENDING')
  const pendingGuests = guests.filter((g) => g.statusRsvp === 'PENDING')
  const declinedGuests = guests.filter((g) => g.statusRsvp === 'DECLINED')

  const totalAttendeesSum = attendingGuests.reduce(
    (acc, cur) => acc + (cur.attendeesCount || 1),
    0
  )

  const metrics = [
    {
      label: 'Total Tamu Terdaftar',
      value: totalGuests,
      sublabel: `${openedGuests} telah membuka undangan`,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Konfirmasi Hadir',
      value: attendingGuests.length,
      sublabel: `~${totalAttendeesSum} orang total estimasi`,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Masih Ragu / Pending',
      value: pendingGuests.length,
      sublabel: 'Belum menetapkan kehadiran',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Tidak Bisa Hadir',
      value: declinedGuests.length,
      sublabel: 'Telah menyampaikan izin',
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      label: 'Estimasi Porsi / Orang',
      value: totalAttendeesSum,
      sublabel: 'Berdasarkan RSVP Hadir',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Doa & Ucapan Masuk',
      value: wishes.length,
      sublabel: 'Tercatat di buku tamu',
      icon: MessageSquareHeart,
      color: 'text-[#8C7851] bg-[#FAF8F5] border-[#E2D9CE]',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Ringkasan Kehadiran &amp; Undangan
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Data real-time untuk pernikahan{' '}
            <span className="font-semibold text-neutral-800">
              {couple?.groomName} &amp; {couple?.brideName}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/guests"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1B2A4A] text-white shadow-sm hover:bg-[#15223c] transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Kelola Data Tamu</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">
                  {m.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${m.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tabular-nums">
                  {m.value}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {m.sublabel}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout: Quick Actions & Recent Wishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Wishes Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquareHeart className="w-4 h-4 text-[#8C7851]" />
              <h2 className="font-serif font-bold text-base text-neutral-900">
                Doa &amp; Ucapan Terbaru
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {wishes.length} Pesan
            </span>
          </div>

          <DashboardWishesList
            initialWishes={wishes}
            coupleSlug={couple?.slug || 'budi-ani'}
          />
        </div>

        {/* Quick Links & Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Navigasi Cepat
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/guests"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-medium text-neutral-800"
              >
                <span>Tambah &amp; Salin Link Tamu</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-medium text-neutral-800"
              >
                <span>Ganti Desain Template</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                href={`/invitation/${couple?.slug || 'budi-ani'}`}
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E2D9CE] hover:bg-[#F4F1EA] transition-colors text-xs font-semibold text-[#8C7851]"
              >
                <span>Lihat Undangan Publik</span>
                <ArrowRight className="w-4 h-4 text-[#8C7851]" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              TEMPLATE AKTIF
            </span>
            <h4 className="font-serif text-lg font-normal">
              {couple?.selectedTemplate === 'TEMPLATE_A' && 'Template A (Soft Arch & Botanical)'}
              {couple?.selectedTemplate === 'TEMPLATE_B' && 'Template B (Contemporary Editorial)'}
              {couple?.selectedTemplate === 'TEMPLATE_C' && 'Template C (Frosted Glass)'}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Anda dapat mengubah tema visual dan gaya layout kapan saja melalui menu Pengaturan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
