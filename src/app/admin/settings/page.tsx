import { notFound } from 'next/navigation'
import React from 'react'
import { CoupleSettingsClient } from '@/components/admin/CoupleSettingsClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const couple = await prisma.couple.findFirst()

  if (!couple) {
    notFound()
  }

  return <CoupleSettingsClient couple={couple} />
}
