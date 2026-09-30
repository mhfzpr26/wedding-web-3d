import React from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CoupleSettingsClient } from '@/components/admin/CoupleSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const couple = await prisma.couple.findFirst()

  if (!couple) {
    notFound()
  }

  return <CoupleSettingsClient couple={couple} />
}
