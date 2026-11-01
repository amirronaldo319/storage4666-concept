import { planById } from '../config/business'
import { useI18n } from '../i18n'
import type { Recommendation } from './recommend'

const INDIVIDUAL = [
  { id: 'basique', r: 15, label: '18"' },
  { id: 'flexibilite', r: 19, label: '20"' },
  { id: 'liberte', r: 23, label: '22"' },
] as const
const GARAGE = [
  { id: 'garage25', label: '25+' },
  { id: 'garage50', label: '50+' },
  { id: 'garage75', label: '75+' },
] as const

/** Lightweight visual: which published plan tier the estimate lands on. Not a size-fit diagram. */
export function Ladder({ rec }: { rec: Extract<Recommendation, { kind: 'plan' }> }) {
  const { t } = useI18n()
  const isGarage = planById(rec.planId)?.audience === 'garage'
  const items = isGarage ? GARAGE : INDIVIDUAL
  return (
    <figure className="ladder">
      <svg viewBox="0 0 210 64" role="img" aria-label={`${t('guide.ladder.label')} — ${t('guide.ladder.selected')}: ${planById(rec.planId)?.name}`}>
        {items.map((it, i) => {
          const active = it.id === rec.planId
          const cx = 35 + i * 70
          return (
            <g key={it.id} className={active ? 'ladder-item is-active' : 'ladder-item'}>
              {'r' in it ? (
                <>
                  <circle cx={cx} cy="28" r={it.r} />
                  <circle cx={cx} cy="28" r={it.r * 0.45} className="hub" />
                </>
              ) : (
                <rect x={cx - 20} y="10" width="40" height="36" rx="4" />
              )}
              <text x={cx} y="62" textAnchor="middle">{it.label}</text>
              {active && <path d={`M${cx - 6} 28.5l4.5 4.5 8-9`} className="tick" />}
            </g>
          )
        })}
      </svg>
      <figcaption className="visually-hidden">{t('guide.ladder.label')}</figcaption>
    </figure>
  )
}
