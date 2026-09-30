import React from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { GuestManagerClient } from '@/components/admin/GuestManagerClient'

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
