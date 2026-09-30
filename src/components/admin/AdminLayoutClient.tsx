'use client'

import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { logout } from '@/actions/auth'

interface AdminLayoutClientProps {
  children: React.ReactNode
  adminEmail: string
}

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children, adminEmail }) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Manajemen Tamu',
      href: '/admin/guests',
      icon: Users,
    },
    {
      label: 'Pengaturan Undangan',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans flex flex-col md:flex-row selection:bg-[#B39365] selection:text-white">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-neutral-900 text-white sticky top-0 z-40 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-serif font-semibold text-sm tracking-wide">Wedding Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-neutral-200 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Brand */}
          <div className="flex items-center space-x-2.5 pb-4 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white tracking-wide">
                Wedding Panel
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">Budi &amp; Anindya</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-neutral-950 shadow-md font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-neutral-800 space-y-3">
          <Link
            href="/invitation/budi-ani"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lihat Undangan</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Live</span>
          </Link>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
            <span className="truncate max-w-[130px]" title={adminEmail}>
              {adminEmail}
            </span>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  )
}

export default AdminLayoutClient
