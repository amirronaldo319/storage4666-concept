import { isValidISODate } from './dates'
import type { Answers, Errors, Step } from './types'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const digitCount = (s: string) => s.replace(/\D/g, '').length

/**
 * Validates only the fields that belong to `step`. `today` is the visitor's
 * local calendar date (YYYY-MM-DD) so tests and the UI agree on "today".
 * Phone is required only when the visitor chose telephone as contact method.
 */
export function validateStep(step: Step, a: Answers, today: string): Errors {
  const errors: Errors = {}
  if (step === 1) {
    if (!a.topic) errors.topic = 'required'
  }
  if (step === 2) {
    if (!a.startMode) errors.startMode = 'required'
    else if (a.startMode === 'date') {
      if (!a.startDate) errors.startDate = 'required'
      else if (!isValidISODate(a.startDate)) errors.startDate = 'invalid'
      else if (a.startDate < today) errors.startDate = 'past'
    }
  }
  if (step === 3) {
    if (!a.name.trim()) errors.name = 'required'
    if (!a.email.trim()) errors.email = 'required'
    else if (!EMAIL.test(a.email.trim())) errors.email = 'invalid'
    const phone = a.phone.trim()
    if (a.method === 'phone' && !phone) errors.phone = 'phoneNeeded'
    else if (phone && digitCount(phone) < 7) errors.phone = 'invalid'
  }
  return errors
}

/** First step (1–3) that has errors, with its errors; null when everything passes. */
export function firstInvalidStep(a: Answers, today: string): { step: Step; errors: Errors } | null {
  for (const step of [1, 2, 3] as const) {
    const errors = validateStep(step, a, today)
    if (Object.keys(errors).length > 0) return { step, errors }
  }
  return null
}
