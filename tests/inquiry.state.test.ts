import { describe, expect, it } from 'vitest'
import { isValidISODate, toLocalISODate } from '../src/inquiry/dates'
import { hasDraft, initialState, reducer, type Action } from '../src/inquiry/state'
import { validateStep } from '../src/inquiry/validate'
import type { InquiryState } from '../src/inquiry/types'

const TODAY = '2026-11-01'
const run = (s: InquiryState, ...actions: Action[]) => actions.reduce(reducer, s)
const set = (field: keyof InquiryState['answers'], value: never): Action => ({ type: 'set', field, value })

describe('local dates', () => {
  it('keeps the visitor’s calendar day late in the evening (no UTC shift)', () => {
    expect(toLocalISODate(new Date(2026, 0, 31, 23, 45))).toBe('2026-01-31')
    expect(toLocalISODate(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01')
  })
  it('rejects impossible dates', () => {
    expect(isValidISODate('2026-02-30')).toBe(false)
    expect(isValidISODate('2028-02-29')).toBe(true)
  })
  it('accepts today, rejects yesterday', () => {
    const a = { ...initialState().answers, startMode: 'date' as const }
    expect(validateStep(2, { ...a, startDate: TODAY }, TODAY)).toEqual({})
    expect(validateStep(2, { ...a, startDate: '2026-10-31' }, TODAY)).toEqual({ startDate: 'past' })
  })
})

describe('step validation', () => {
  it('only validates the fields of the current step', () => {
    const s = run(initialState(), { type: 'next', today: TODAY })
    expect(s.step).toBe(1)
    expect(Object.keys(s.errors)).toEqual(['topic'])
  })

  it('advances once the step is valid and keeps answers when going back', () => {
    const s = run(initialState(), set('topic', 'unsure' as never), set('details', 'Michelin 225/45 R17' as never), { type: 'next', today: TODAY }, { type: 'back' })
    expect(s.step).toBe(1)
    expect(s.answers.details).toBe('Michelin 225/45 R17')
    expect(s.answers.topic).toBe('unsure')
  })

  it('never requires a phone number for email contact', () => {
    const a = { ...initialState().answers, name: 'Alex', email: 'alex@example.com', method: 'email' as const, phone: '' }
    expect(validateStep(3, a, TODAY)).toEqual({})
  })

  it('requires a phone number only when telephone is chosen, and stays lenient on format', () => {
    const base = { ...initialState().answers, name: 'Alex', email: 'alex@example.com' }
    expect(validateStep(3, { ...base, method: 'phone', phone: '' }, TODAY)).toEqual({ phone: 'phoneNeeded' })
    expect(validateStep(3, { ...base, method: 'phone', phone: '+1 (514) 555-0100 poste 4' }, TODAY)).toEqual({})
    expect(validateStep(3, { ...base, method: 'email', phone: '12' }, TODAY)).toEqual({ phone: 'invalid' })
  })

  it('clears a field’s error as soon as it is edited', () => {
    let s = run(initialState(), { type: 'next', today: TODAY })
    expect(s.errors.topic).toBe('required')
    s = run(s, set('topic', 'other' as never))
    expect(s.errors.topic).toBeUndefined()
  })
})

describe('completion and reset', () => {
  const filled = () =>
    run(
      initialState(),
      set('topic', 'tire-storage' as never),
      set('startMode', 'flexible' as never),
      set('name', 'Alex' as never),
      set('email', 'alex@example.com' as never),
    )

  it('jumps back to the first invalid step instead of completing', () => {
    const s = run(initialState(), { type: 'complete', today: TODAY })
    expect(s.status).toBe('draft')
    expect(s.step).toBe(1)
  })

  it('completes once; a second completion changes nothing', () => {
    const once = run(filled(), { type: 'complete', today: TODAY })
    expect(once.status).toBe('done')
    expect(reducer(once, { type: 'complete', today: TODAY })).toBe(once)
    expect(reducer(once, set('name', 'Other' as never))).toBe(once)
  })

  it('reset discards everything', () => {
    const s = run(filled(), { type: 'reset' })
    expect(hasDraft(s)).toBe(false)
    expect(s.answers.name).toBe('')
  })

  it('contextual preselection keeps other answers and returns to step 1', () => {
    const s = run(filled(), { type: 'goto', step: 3 }, { type: 'preselect', topic: 'pro-storage', plan: 'garage50' })
    expect(s.step).toBe(1)
    expect(s.answers.plan).toBe('garage50')
    expect(s.answers.name).toBe('Alex')
  })
})
