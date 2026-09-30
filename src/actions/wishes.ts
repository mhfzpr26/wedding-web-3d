'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { Wish } from '@/types'

export interface SubmitWishPayload {
  coupleId: string
  guestId?: string | null
  senderName: string
  message: string
  slug?: string
}

export interface WishResponse {
  success: boolean
  message: string
  data?: Wish
}

export async function submitWish(payload: SubmitWishPayload): Promise<WishResponse> {
  try {
    const { coupleId, guestId, senderName, message, slug } = payload

    if (!coupleId) {
      return { success: false, message: 'ID pasangan tidak valid' }
    }

    const trimmedMessage = (message || '').trim()
    if (trimmedMessage.length < 3) {
      return {
        success: false,
        message: 'Doa/ucapan terlalu pendek (minimal 3 karakter)',
      }
    }

    if (trimmedMessage.length > 500) {
      return {
        success: false,
        message: 'Doa/ucapan terlalu panjang (maksimal 500 karakter)',
      }
    }

    let verifiedSenderName = (senderName || '').trim()

    // Identity Security: If guestId is provided, retrieve official name from DB
    if (guestId) {
      const dbGuest = await prisma.guest.findFirst({
        where: {
          id: guestId,
          coupleId,
        },
      })

      if (dbGuest) {
        verifiedSenderName = dbGuest.name
      } else {
        return {
          success: false,
          message: 'Identitas tamu tidak valid untuk pernikahan ini',
        }
      }
    }

    if (!verifiedSenderName) {
      return { success: false, message: 'Nama pengirim wajib diisi' }
    }

    // Create new Wish record
    const createdWish = await prisma.wish.create({
      data: {
        coupleId,
        guestId: guestId || null,
        senderName: verifiedSenderName,
        message: trimmedMessage,
      },
    })

    if (slug) {
      revalidatePath(`/invitation/${slug}`)
    } else {
      revalidatePath('/invitation/[slug]', 'page')
    }

    return {
      success: true,
      message: 'Doa dan ucapan berhasil dikirim',
      data: createdWish,
    }
  } catch (error) {
    console.error('Error submitting wish:', error)
    return {
      success: false,
      message: 'Gagal mengirim ucapan. Silakan coba lagi.',
    }
  }
}

export async function deleteWish(
  wishId: string,
  slug?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.wish.delete({
      where: { id: wishId },
    })

    if (slug) {
      revalidatePath(`/invitation/${slug}`)
    } else {
      revalidatePath('/invitation/[slug]', 'page')
    }
    revalidatePath('/admin/dashboard')

    return { success: true, message: 'Ucapan berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting wish:', error)
    return { success: false, message: 'Gagal menghapus ucapan' }
  }
}
