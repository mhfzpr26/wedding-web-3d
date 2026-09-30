import type {
  BankAccount,
  Couple,
  Event,
  Guest,
  RsvpStatus,
  TemplateType,
  Wish,
} from '@prisma/client'

export type { BankAccount, Couple, Event, Guest, RsvpStatus, TemplateType, Wish }

export type CoupleWithDetails = Couple & {
  events: Event[]
  bankAccounts: BankAccount[]
  wishes: Wish[]
  guests?: Guest[]
}

export interface InvitationProps {
  couple: CoupleWithDetails
  guest?: Guest | null
}
