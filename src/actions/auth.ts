'use server'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE_NAME = 'admin_session'

export interface AuthResponse {
  success: boolean
  message: string
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const password = (formData.get('password') as string) || ''

  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi' }
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin) {
      return { success: false, message: 'Email atau password salah' }
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isPasswordValid) {
      return { success: false, message: 'Email atau password salah' }
    }

    // Create session payload
    const sessionData = {
      id: admin.id,
      email: admin.email,
      timestamp: Date.now(),
    }
    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64')

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, message: 'Login berhasil' }
  } catch (error) {
    console.error('Error during admin login:', error)
    return { success: false, message: 'Terjadi kesalahan sistem' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect('/admin/login')
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) return null

    const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'))
    if (!decoded?.id || !decoded?.email) return null

    return decoded as { id: string; email: string; timestamp: number }
  } catch {
    return null
  }
}
