/**
 * Business facts for Storage4666, each tagged with how far it can be trusted.
 *  - verified:     published on storage4666.ca (see docs/sources-and-confirmations.md)
 *  - illustrative: a design proposal / example, never presented as a business fact
 *  - pending:      unknown or contradictory; the owner must confirm. Not rendered.
 */
export type FactStatus = 'verified' | 'illustrative' | 'pending'

export interface Fact<T> {
  value: T
  status: FactStatus
  source: string
}

const verified = <T,>(value: T, source: string): Fact<T> => ({ value, status: 'verified', source })
const pending = <T,>(value: T, source: string): Fact<T> => ({ value, status: 'pending', source })

const SITE = 'https://storage4666.ca'

export const business = {
  name: verified('Storage4666', `${SITE}/`),
  phone: verified({ display: '+1 514 583 8317', tel: '+15145838317' }, `${SITE}/contact/`),
  email: verified('contact@storage4666.ca', `${SITE}/contact/`),
  address: verified(
    { street: '3700 Rue Griffith', city: 'Saint-Laurent', region: 'QC', postal: 'H4T 2B3' },
    `${SITE}/contact/`,
  ),
  /** Contact page says "sur rendez-vous uniquement". */
  byAppointmentOnly: verified(true, `${SITE}/contact/`),
  serviceArea: verified(['Montréal', 'Laval', 'Terrebonne'], `${SITE}/`),
  facebook: verified('https://www.facebook.com/profile.php?id=61552348389364', `${SITE}/contact/`),
  currentSite: SITE,
  /** The contact page's embedded map targets a different address (1467 Rue Bégin, H4R 1V8). */
  mapEmbed: pending('conflicting address on contact page', `${SITE}/contact/`),
  openingHours: pending('not published', `${SITE}/contact/`),
  seasons: verified(
    { winter: { from: '11-01', to: '04-30' }, summer: { from: '05-01', to: '10-31' } },
    `${SITE}/politique-de-remboursement/`,
  ),
  /** 25 sets = 100 tires on the Forfaits page. */
  tiresPerSet: verified(4, `${SITE}/forfaits/`),
  termsPrinciples: verified(
    { noRefundOnceFinalized: true, creditNextSeason: true, finalizedMeansPaid: true, carryFeeCad: 5 },
    `${SITE}/politique-de-remboursement/`,
  ),
} as const

export function directionsUrl(): string {
  const a = business.address.value
  const q = encodeURIComponent(`${a.street}, ${a.city}, ${a.region} ${a.postal}`)
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`
}

export type PlanId = 'basique' | 'flexibilite' | 'liberte' | 'garage25' | 'garage50' | 'garage75'
export type PlanAudience = 'individual' | 'garage'

export interface Plan {
  id: PlanId
  name: string
  audience: PlanAudience
  /** Published price in CAD, before taxes, per set for six months. */
  priceCad: number
  maxDiameterIn: 18 | 20 | 22
  /** Pickups included (individual plans). */
  pickupsIncluded?: number
  /** Pickup radius in km. */
  radiusKm?: number
  /** Minimum sets (garage plans). */
  minSets?: number
  withOrWithoutRims?: boolean
  source: string
}

export const plans: readonly Plan[] = [
  { id: 'basique', name: 'Basique', audience: 'individual', priceCad: 59, maxDiameterIn: 18, pickupsIncluded: 0, source: `${SITE}/forfaits/` },
  { id: 'flexibilite', name: 'Flexibilité', audience: 'individual', priceCad: 79, maxDiameterIn: 20, pickupsIncluded: 1, radiusKm: 20, source: `${SITE}/forfaits/` },
  { id: 'liberte', name: 'Liberté', audience: 'individual', priceCad: 99, maxDiameterIn: 22, pickupsIncluded: 2, radiusKm: 50, source: `${SITE}/forfaits/` },
  { id: 'garage25', name: 'GARAGE25', audience: 'garage', priceCad: 69.99, maxDiameterIn: 20, minSets: 25, radiusKm: 25, withOrWithoutRims: true, source: `${SITE}/forfaits/` },
  { id: 'garage50', name: 'GARAGE50', audience: 'garage', priceCad: 59.99, maxDiameterIn: 22, minSets: 50, radiusKm: 35, withOrWithoutRims: true, source: `${SITE}/forfaits/` },
  { id: 'garage75', name: 'GARAGE75', audience: 'garage', priceCad: 49.99, maxDiameterIn: 22, minSets: 75, radiusKm: 40, withOrWithoutRims: true, source: `${SITE}/forfaits/` },
]

export const planById = (id: string): Plan | undefined => plans.find((p) => p.id === id)
