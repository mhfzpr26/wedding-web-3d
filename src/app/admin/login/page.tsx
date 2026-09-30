'use client'

import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { login } from '@/actions/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@wedding.com')
  const [password, setPassword] = useState('adminpassword123')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const result = await login(formData)
      if (result.success) {
        toast.success('Login berhasil! Mengalihkan ke dashboard...')
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        toast.error(result.message || 'Login gagal')
      }
    } catch {
      toast.error('Terjadi kesalahan saat memproses login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-4 text-white font-sans selection:bg-[#B39365] selection:text-white">
      {/* Background ambient decorative glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md backdrop-blur-xl bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/90 border border-neutral-700 flex items-center justify-center mx-auto shadow-inner text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-white">
            Portal Admin Undangan
          </h1>
          <p className="text-xs text-neutral-400">
            Masuk untuk mengelola tamu, rsvp, dan pengaturan tema
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">Kredensial Default:</span>
            </div>
            <p>
              Email: <code className="text-neutral-300">admin@wedding.com</code>
            </p>
            <p>
              Password: <code className="text-neutral-300">adminpassword123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-[#D4AF37] hover:bg-[#b8952b] text-neutral-950 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
