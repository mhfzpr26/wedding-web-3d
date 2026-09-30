'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { TemplateType } from '@/types'

export interface UpdateCoupleSettingsPayload {
  coupleId: string
  selectedTemplate: TemplateType
  groomName: string
  brideName: string
  groomParents?: string | null
  brideParents?: string | null
  coverPhotoUrl?: string | null
  groomPhotoUrl?: string | null
  bridePhotoUrl?: string | null
  closingPhotoUrl?: string | null
  videoUrl?: string | null
  backgroundMusicUrl?: string | null
  openingQuoteTitle?: string | null
  openingQuoteText?: string | null
  closingMessage?: string | null
  dressCodeDesc?: string | null
  isPhotolessMode?: boolean
}

export async function updateCoupleSettings(payload: UpdateCoupleSettingsPayload) {
  try {
    const {
      coupleId,
      selectedTemplate,
      groomName,
      brideName,
      groomParents,
      brideParents,
      coverPhotoUrl,
      groomPhotoUrl,
      bridePhotoUrl,
      closingPhotoUrl,
      videoUrl,
      backgroundMusicUrl,
      openingQuoteTitle,
      openingQuoteText,
      closingMessage,
      dressCodeDesc,
      isPhotolessMode,
    } = payload

    const updated = await prisma.couple.update({
      where: { id: coupleId },
      data: {
        selectedTemplate,
        groomName: groomName.trim(),
        brideName: brideName.trim(),
        groomParents: groomParents?.trim() || null,
        brideParents: brideParents?.trim() || null,
        openingQuoteTitle: openingQuoteTitle?.trim() || null,
        openingQuoteText: openingQuoteText?.trim() || null,
        closingMessage: closingMessage?.trim() || null,
        dressCodeDesc: dressCodeDesc?.trim() || null,
        backgroundMusicUrl: backgroundMusicUrl?.trim() || null,
        // If photoless mode is turned on, set media URLs to null
        coverPhotoUrl: isPhotolessMode ? null : coverPhotoUrl?.trim() || null,
        groomPhotoUrl: isPhotolessMode ? null : groomPhotoUrl?.trim() || null,
        bridePhotoUrl: isPhotolessMode ? null : bridePhotoUrl?.trim() || null,
        closingPhotoUrl: isPhotolessMode ? null : closingPhotoUrl?.trim() || null,
        videoUrl: isPhotolessMode ? null : videoUrl?.trim() || null,
      },
    })

    revalidatePath(`/invitation/${updated.slug}`)
    revalidatePath('/invitation/[slug]', 'page')
    revalidatePath('/admin/settings')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      message: 'Pengaturan undangan berhasil disimpan',
      data: updated,
    }
  } catch (error) {
    console.error('Error updating couple settings:', error)
    return {
      success: false,
      message: 'Gagal memperbarui pengaturan undangan',
    }
  }
}
