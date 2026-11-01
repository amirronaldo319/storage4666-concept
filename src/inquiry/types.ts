import type { PlanId } from '../config/business'

/** All stored values are language-independent identifiers. */
export type Topic = 'tire-storage' | 'pro-storage' | 'tire-sale' | 'other' | 'unsure'
export type PlanChoice = PlanId | 'unsure'
export type StartMode = 'date' | 'flexible' | 'unsure'
export type Duration = '6m' | 'other' | 'unsure'
export type ContactMethod = 'email' | 'phone'

export type Audience = 'individual' | 'garage' | 'building'
export type DiameterBand = '18' | '20' | '22' | 'over' | 'unsure'
export type PickupNeed = 'dropoff' | 'home' | 'garage'

/** Selections carried over from the guide. An approximate need, not a confirmed unit. */
export interface GuideHint {
  audience: Audience
  diameter: DiameterBand
  sets: number
  pickup: PickupNeed
}

export interface Answers {
  topic: Topic | ''
  plan: PlanChoice
  details: string
  hint: GuideHint | null
  startMode: StartMode | ''
  startDate: string
  duration: Duration
  name: string
  email: string
  phone: string
  method: ContactMethod
  message: string
}

export type FieldKey =
  | 'topic'
  | 'startMode'
  | 'startDate'
  | 'name'
  | 'email'
  | 'phone'

export type ErrorCode = 'required' | 'invalid' | 'past' | 'phoneNeeded'
export type Errors = Partial<Record<FieldKey, ErrorCode>>

export type Step = 1 | 2 | 3 | 4
export const STEPS: readonly Step[] = [1, 2, 3, 4]

export interface InquiryState {
  answers: Answers
  step: Step
  status: 'draft' | 'done'
  errors: Errors
}
