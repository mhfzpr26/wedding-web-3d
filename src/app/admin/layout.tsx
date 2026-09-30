import React from 'react'
import type { Metadata } from 'next'
import { getAdminSession } from '@/actions/auth'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Wedding Web 3D',
  description: 'Panel Manajemen Undangan Pernikahan Digital',
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  return (
    <AdminLayoutClient adminEmail={session?.email || 'admin@wedding.com'}>
      {children}
    </AdminLayoutClient>
  )
}
