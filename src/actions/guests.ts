'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function markGuestAsOpened(guestId: string) {
  if (!guestId) return { success: false, message: 'ID tamu tidak valid' }

  try {
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { isOpened: true },
    })

    return { success: true, isOpened: updatedGuest.isOpened }
  } catch (error) {
    console.error('Error marking guest as opened:', error)
    return { success: false, message: 'Gagal memperbarui status buka undangan' }
  }
}

export async function getGuests(coupleId: string) {
  try {
    const guests = await prisma.guest.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: guests }
  } catch (error) {
    console.error('Error fetching guests:', error)
    return { success: false, message: 'Gagal mengambil data tamu', data: [] }
  }
}

export async function createGuest({
  coupleId,
  name,
  phoneNumber,
  customSlug,
}: {
  coupleId: string
  name: string
  phoneNumber?: string
  customSlug?: string
}) {
  try {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, message: 'Nama tamu tidak boleh kosong' }
    }

    const baseSlug =
      customSlug?.trim() ||
      trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      'tamu'

    // Ensure unique slug within the couple
    let uniqueSlug = baseSlug
    let counter = 1
    while (true) {
      const existing = await prisma.guest.findFirst({
        where: { coupleId, slug: uniqueSlug },
      })
      if (!existing) break
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
    }

    const created = await prisma.guest.create({
      data: {
        coupleId,
        name: trimmedName,
        slug: uniqueSlug,
        phoneNumber: phoneNumber?.trim() || null,
        statusRsvp: 'PENDING',
        attendeesCount: 1,
      },
    })

    revalidatePath('/admin/guests')
    revalidatePath('/admin/dashboard')

    return { success: true, message: 'Tamu berhasil ditambahkan', data: created }
  } catch (error) {
    console.error('Error creating guest:', error)
    return { success: false, message: 'Gagal menambahkan tamu' }
  }
}

export async function createBatchGuests({
  coupleId,
  names,
}: {
  coupleId: string
  names: string[]
}) {
  try {
    const cleanNames = names.map((n) => n.trim()).filter((n) => n.length > 0)

    if (cleanNames.length === 0) {
      return { success: false, message: 'Daftar nama kosong' }
    }

    let addedCount = 0
    for (const name of cleanNames) {
      const baseSlug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || 'tamu'

      let uniqueSlug = baseSlug
      let counter = 1
      while (true) {
        const existing = await prisma.guest.findFirst({
          where: { coupleId, slug: uniqueSlug },
        })
        if (!existing) break
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      await prisma.guest.create({
        data: {
          coupleId,
          name,
          slug: uniqueSlug,
          statusRsvp: 'PENDING',
          attendeesCount: 1,
        },
      })
      addedCount++
    }

    revalidatePath('/admin/guests')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      message: `${addedCount} tamu berhasil ditambahkan secara massal`,
    }
  } catch (error) {
    console.error('Error batch creating guests:', error)
    return { success: false, message: 'Gagal menambahkan tamu secara massal' }
  }
}

export async function deleteGuest(guestId: string) {
  try {
    await prisma.guest.delete({
      where: { id: guestId },
    })

    revalidatePath('/admin/guests')
    revalidatePath('/admin/dashboard')

    return { success: true, message: 'Tamu berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting guest:', error)
    return { success: false, message: 'Gagal menghapus data tamu' }
  }
}
