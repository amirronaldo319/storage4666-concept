import { plans, type PlanId } from '../config/business'
import type { Audience, DiameterBand, GuideHint, PickupNeed } from '../inquiry/types'

export interface GuideSelection {
  audience: Audience | null
  diameter: DiameterBand | null
  pickup: PickupNeed | null
  sets: number
}

export const initialGuide = (): GuideSelection => ({ audience: null, diameter: null, pickup: null, sets: 1 })

export type ReasonKey =
  | 'diameter'
  | 'pickupHome'
  | 'pickupGarage'
  | 'volumeTier'
  | 'diameterUnknown'
  | 'belowGarageMin'
  | 'diameterVsVolume'
  | 'oversize'
  | 'building'

export type Recommendation =
  | { kind: 'incomplete' }
  | { kind: 'plan'; planId: PlanId; reasons: ReasonKey[]; ladderIndex: 0 | 1 | 2 | null }
  | { kind: 'quote'; reasons: ReasonKey[] }

export const MAX_SETS = 200

const DIAMETER_TIER: Record<DiameterBand, number | null> = { '18': 0, '20': 1, '22': 2, over: null, unsure: 0 }
const PICKUP_TIER: Record<PickupNeed, number> = { dropoff: 0, home: 1, garage: 2 }
const INDIVIDUAL: readonly PlanId[] = ['basique', 'flexibilite', 'liberte']

/**
 * Rule-based match against the published plan limits (max tire diameter,
 * included pickups, garage minimum sets). It is an approximation: the team
 * confirms the real fit. No volume estimate is made.
 */
export function recommend(sel: GuideSelection): Recommendation {
  const { audience, diameter, pickup, sets } = sel
  if (!audience) return { kind: 'incomplete' }
  if (audience === 'building') return { kind: 'quote', reasons: ['building'] }

  if (audience === 'garage') {
    if (!diameter) return { kind: 'incomplete' }
    if (diameter === 'over') return { kind: 'quote', reasons: ['oversize'] }
    const reasons: ReasonKey[] = ['volumeTier']
    if (sets < 25) return { kind: 'quote', reasons: ['belowGarageMin'] }
    const needsLarge = diameter === '22'
    if (sets >= 75) return { kind: 'plan', planId: 'garage75', reasons, ladderIndex: null }
    if (sets >= 50) return { kind: 'plan', planId: 'garage50', reasons, ladderIndex: null }
    if (needsLarge) return { kind: 'quote', reasons: ['diameterVsVolume'] }
    if (diameter === 'unsure') reasons.push('diameterUnknown')
    return { kind: 'plan', planId: 'garage25', reasons, ladderIndex: null }
  }

  if (!diameter || !pickup) return { kind: 'incomplete' }
  const diameterTier = DIAMETER_TIER[diameter]
  if (diameterTier === null) return { kind: 'quote', reasons: ['oversize'] }
  const pickupTier = PICKUP_TIER[pickup]
  const tier = Math.max(diameterTier, pickupTier) as 0 | 1 | 2
  const reasons: ReasonKey[] = []
  if (diameter === 'unsure') reasons.push('diameterUnknown')
  else if (diameterTier >= pickupTier) reasons.push('diameter')
  if (pickupTier >= diameterTier && pickup === 'home') reasons.push('pickupHome')
  if (pickupTier >= diameterTier && pickup === 'garage') reasons.push('pickupGarage')
  return { kind: 'plan', planId: INDIVIDUAL[tier], reasons, ladderIndex: tier }
}

export function toHint(sel: GuideSelection): GuideHint | null {
  if (!sel.audience) return null
  return {
    audience: sel.audience,
    diameter: sel.diameter ?? 'unsure',
    sets: sel.sets,
    pickup: sel.pickup ?? 'dropoff',
  }
}

export const planLabelFor = (id: PlanId): string => plans.find((p) => p.id === id)?.name ?? id
