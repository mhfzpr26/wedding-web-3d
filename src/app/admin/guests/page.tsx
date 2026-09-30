import { notFound } from 'next/navigation'
import React from 'react'
import { GuestManagerClient } from '@/components/admin/GuestManagerClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminGuestsPage() {
  const couple = await prisma.couple.findFirst({
    include: {
      guests: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!couple) {
    notFound()
  }

  return (
    <GuestManagerClient
      initialGuests={couple.guests}
      coupleId={couple.id}
      coupleSlug={couple.slug}
      groomName={couple.groomName}
      brideName={couple.brideName}
    />
  )
}
