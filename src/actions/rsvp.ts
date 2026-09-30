'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RsvpStatus } from '@/types'

export interface SubmitRsvpPayload {
  coupleId: string
  guestId?: string | null
  status: RsvpStatus
  attendeesCount: number
  name?: string
  slug?: string
}

export interface RsvpResponse {
  success: boolean
  message: string
}

export async function submitRsvp(
  payload: SubmitRsvpPayload
): Promise<RsvpResponse> {
  try {
    const { coupleId, guestId, status, attendeesCount, name, slug } = payload

    if (!coupleId) {
      return { success: false, message: 'ID pasangan tidak valid' }
    }

    const validStatuses: RsvpStatus[] = ['PENDING', 'ATTENDING', 'DECLINED']
    if (!validStatuses.includes(status)) {
      return { success: false, message: 'Status RSVP tidak valid' }
    }

    const count = status === 'ATTENDING' ? Math.max(1, attendeesCount || 1) : 0

    // 1. If guestId exists, verify against DB to prevent client tampering
    if (guestId) {
      const existingGuest = await prisma.guest.findFirst({
        where: {
          id: guestId,
          coupleId,
        },
      })

      if (!existingGuest) {
        return {
          success: false,
          message: 'Data tamu tidak ditemukan untuk undangan ini',
        }
      }

      await prisma.guest.update({
        where: { id: guestId },
        data: {
          statusRsvp: status,
          attendeesCount: count,
        },
      })
    } else {
      // 2. Generic guest (no locked guestId)
      const guestName = (name || 'Tamu Undangan').trim()
      if (!guestName) {
        return { success: false, message: 'Nama tamu wajib diisi' }
      }

      // Generate a URL-friendly unique slug
      const baseSlug =
        guestName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || 'tamu'
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

      await prisma.guest.create({
        data: {
          coupleId,
          name: guestName,
          slug: uniqueSlug,
          statusRsvp: status,
          attendeesCount: count,
          isOpened: true,
        },
      })
    }

    if (slug) {
      revalidatePath(`/invitation/${slug}`)
    } else {
      revalidatePath('/invitation/[slug]', 'page')
    }

    return {
      success: true,
      message: 'Konfirmasi kehadiran berhasil disimpan',
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    return {
      success: false,
      message: 'Gagal menyimpan konfirmasi kehadiran. Silakan coba lagi.',
    }
  }
}
