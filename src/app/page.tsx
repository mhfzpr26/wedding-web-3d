import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  let slug: string | null = null

  try {
    const couple = await prisma.couple.findFirst({
      select: { slug: true },
      orderBy: { createdAt: 'asc' },
    })
    slug = couple?.slug ?? null
  } catch (error) {
    console.error('Error fetching couple for root redirect:', error)
  }

  if (slug) {
    redirect(`/invitation/${slug}`)
  }

  redirect('/admin')
}
