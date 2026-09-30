import type { CoupleWithDetails, Guest } from '@/types'

export type CoverState = 'LOCKED' | 'INTERACTING' | 'REVEALING' | 'OPENED'

export interface CoverProps {
  couple: CoupleWithDetails
  guest?: Guest | null
  onOpenComplete: () => void
}
