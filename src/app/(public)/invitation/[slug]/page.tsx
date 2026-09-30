export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { TemplateA } from '@/components/templates/TemplateA'
import { TemplateB } from '@/components/templates/TemplateB'
import { TemplateC } from '@/components/templates/TemplateC'
import { prisma } from '@/lib/prisma'
import type { CoupleWithDetails, Guest, InvitationProps, TemplateType } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const TEMPLATE_MAP: Record<TemplateType, React.ComponentType<InvitationProps>> = {
  TEMPLATE_A: TemplateA,
  TEMPLATE_B: TemplateB,
  TEMPLATE_C: TemplateC,
}

async function getCoupleData(slug: string): Promise<CoupleWithDetails | null> {
  try {
    const couple = await prisma.couple.findUnique({
      where: { slug },
      include: {
        events: {
          orderBy: { sortOrder: 'asc' },
        },
        bankAccounts: {
          orderBy: { sortOrder: 'asc' },
        },
        wishes: {
          orderBy: { createdAt: 'desc' },
        },
        guests: true,
      },
    })
    return couple
  } catch (error) {
    console.error('Error fetching couple data from DB:', error)
    return null
  }
}

function findGuest(couple: CoupleWithDetails, toParam?: string): Guest | null {
  if (!toParam || !toParam.trim()) return null

  const cleanName = toParam.trim()
  const guestSlug = cleanName.toLowerCase().replace(/\s+/g, '-')

  // Match against preloaded guests from DB relation
  if (couple.guests && couple.guests.length > 0) {
    const matched = couple.guests.find(
      (g) => g.slug.toLowerCase() === guestSlug || g.name.toLowerCase() === cleanName.toLowerCase()
    )
    if (matched) {
      return matched
    }
  }

  // Fallback temporary guest representation if not yet registered in DB
  return {
    id: '',
    coupleId: couple.id,
    name: cleanName,
    slug: guestSlug,
    phoneNumber: null,
    isOpened: true,
    statusRsvp: 'PENDING',
    attendeesCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const to = typeof resolvedSearchParams?.to === 'string' ? resolvedSearchParams.to : undefined

  const couple = await getCoupleData(slug)
  if (!couple) {
    return {
      title: 'Undangan Tidak Ditemukan',
    }
  }

  return {
    title: `The Wedding of ${couple.groomName} & ${couple.brideName}`,
    description: to ? `Undangan Spesial untuk ${to}` : 'Undangan Pernikahan Digital 3D',
  }
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const toParam = typeof resolvedSearchParams?.to === 'string' ? resolvedSearchParams.to : undefined

  const couple = await getCoupleData(slug)
  if (!couple) {
    notFound()
  }

  const guest = findGuest(couple, toParam)

  const SelectedTemplate = TEMPLATE_MAP[couple.selectedTemplate] || TemplateA

  return <SelectedTemplate couple={couple} guest={guest} />
}
