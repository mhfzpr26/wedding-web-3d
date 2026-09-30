import type {
  Couple,
  Event,
  BankAccount,
  Guest,
  Wish,
  TemplateType,
  RsvpStatus,
} from '@prisma/client'

export type {
  Couple,
  Event,
  BankAccount,
  Guest,
  Wish,
  TemplateType,
  RsvpStatus,
}

export type CoupleWithDetails = Couple & {
  events: Event[];
  bankAccounts: BankAccount[];
  wishes: Wish[];
  guests?: Guest[];
};

export interface InvitationProps {
  couple: CoupleWithDetails;
  guest?: Guest | null;
}
