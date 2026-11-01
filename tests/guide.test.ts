import { describe, expect, it } from 'vitest'
import { initialGuide, recommend } from '../src/guide/recommend'

const g = (p: Partial<ReturnType<typeof initialGuide>>) => ({ ...initialGuide(), ...p })

describe('guide recommendation (published limits only)', () => {
  it('waits for enough answers', () => {
    expect(recommend(g({})).kind).toBe('incomplete')
    expect(recommend(g({ audience: 'individual', diameter: '18' })).kind).toBe('incomplete')
  })
  it('picks the cheapest individual plan that covers both diameter and pickup', () => {
    const plan = (diameter: 'unsure' | '18' | '20' | '22', pickup: 'dropoff' | 'home' | 'garage') => {
      const r = recommend(g({ audience: 'individual', diameter, pickup }))
      return r.kind === 'plan' ? r.planId : r.kind
    }
    expect(plan('18', 'dropoff')).toBe('basique')
    expect(plan('18', 'home')).toBe('flexibilite')
    expect(plan('20', 'dropoff')).toBe('flexibilite')
    expect(plan('18', 'garage')).toBe('liberte')
    expect(plan('22', 'dropoff')).toBe('liberte')
  })
  it('does not invent a plan for oversize tires or property managers', () => {
    expect(recommend(g({ audience: 'individual', diameter: 'over', pickup: 'home' })).kind).toBe('quote')
    expect(recommend(g({ audience: 'building' })).kind).toBe('quote')
  })
  it('maps garage volumes to the published tiers and flags gaps', () => {
    const plan = (sets: number, diameter: '20' | '22') => {
      const r = recommend(g({ audience: 'garage', diameter, sets }))
      return r.kind === 'plan' ? r.planId : r.kind
    }
    expect(plan(10, '20')).toBe('quote')
    expect(plan(25, '20')).toBe('garage25')
    expect(plan(25, '22')).toBe('quote') // 21–22 in. starts at GARAGE50
    expect(plan(50, '22')).toBe('garage50')
    expect(plan(120, '20')).toBe('garage75')
  })
})
