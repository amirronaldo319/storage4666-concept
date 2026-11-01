import { useState } from 'react'
import { Button } from '../components/Button'
import { RadioGroup, type Option } from '../components/forms'
import { planById } from '../config/business'
import { useI18n, type Key } from '../i18n'
import { useInquiry } from '../inquiry/InquiryContext'
import type { Audience, DiameterBand, PickupNeed } from '../inquiry/types'
import { initialGuide, MAX_SETS, recommend, toHint, type GuideSelection, type Recommendation } from './recommend'
import { Ladder } from './Ladder'

const k = (s: string) => s as Key

export function Guide() {
  const { t, price } = useI18n()
  const { open } = useInquiry()
  const [sel, setSel] = useState<GuideSelection>(initialGuide)
  const rec = recommend(sel)
  const patch = (p: Partial<GuideSelection>) => setSel((s) => ({ ...s, ...p }))

  const audiences: Option<Audience>[] = (['individual', 'garage', 'building'] as const).map((v) => ({ value: v, label: t(k(`guide.q1.${v}`)) }))
  const diameters: Option<DiameterBand>[] = (['18', '20', '22', 'over', 'unsure'] as const).map((v) => ({ value: v, label: t(k(`guide.q2.${v}`)) }))
  const pickups: Option<PickupNeed>[] = (['dropoff', 'home', 'garage'] as const).map((v) => ({ value: v, label: t(k(`guide.q3.${v}`)) }))
  const needsDiameter = sel.audience === 'individual' || sel.audience === 'garage'
  const setSets = (n: number) => patch({ sets: Math.min(MAX_SETS, Math.max(1, Math.round(n) || 1)) })

  const useEstimate = () => {
    const hint = toHint(sel)
    if (rec.kind === 'plan') {
      const plan = planById(rec.planId)
      open({ topic: plan?.audience === 'garage' ? 'pro-storage' : 'tire-storage', plan: rec.planId, hint })
    } else {
      open({ topic: 'pro-storage', plan: 'unsure', hint })
    }
  }

  return (
    <div className="guide-grid">
      <div className="guide-form">
        <RadioGroup legend={t('guide.q1')} name="guide-audience" value={sel.audience ?? ''} options={audiences} onChange={(v) => patch({ audience: v })} compact />
        {needsDiameter && (
          <RadioGroup legend={t('guide.q2')} hint={t('guide.q2.hint')} name="guide-diameter" value={sel.diameter ?? ''} options={diameters} onChange={(v) => patch({ diameter: v })} compact />
        )}
        {sel.audience === 'individual' && (
          <RadioGroup legend={t('guide.q3')} name="guide-pickup" value={sel.pickup ?? ''} options={pickups} onChange={(v) => patch({ pickup: v })} compact />
        )}
        {(sel.audience === 'individual' || sel.audience === 'garage') && (
          <div className="field">
            <label htmlFor="guide-sets">{t('guide.q4')}</label>
            <p className="hint">{t('guide.q4.hint')}</p>
            <div className="stepper">
              <button type="button" aria-label={t('guide.q4.dec')} onClick={() => setSets(sel.sets - 1)} disabled={sel.sets <= 1}>−</button>
              <input id="guide-sets" className="control" type="number" inputMode="numeric" min={1} max={MAX_SETS} value={sel.sets} onChange={(e) => setSets(Number(e.target.value))} />
              <button type="button" aria-label={t('guide.q4.inc')} onClick={() => setSets(sel.sets + 1)} disabled={sel.sets >= MAX_SETS}>+</button>
            </div>
          </div>
        )}
        <button type="button" className="link-button on-dark" onClick={() => setSel(initialGuide())}>{t('guide.reset')}</button>
      </div>

      <aside className="guide-result" aria-labelledby="guide-result-title">
        <h3 id="guide-result-title">{t('guide.result.title')}</h3>
        <ResultBody rec={rec} price={price} />
        <div className="visually-hidden" role="status" aria-live="polite">{statusText(rec, t)}</div>
        {rec.kind !== 'incomplete' && (
          <Button variant="primary" onClick={useEstimate}>
            {rec.kind === 'plan' ? t('guide.result.cta') : t('guide.result.ctaQuote')}
          </Button>
        )}
        <details className="caveat">
          <summary>{t('guide.caveat.title')}</summary>
          <p>{t('guide.caveat.body')}</p>
        </details>
      </aside>
    </div>
  )
}

function statusText(rec: Recommendation, t: ReturnType<typeof useI18n>['t']): string {
  if (rec.kind === 'incomplete') return t('guide.status.empty')
  if (rec.kind === 'quote') return t('guide.status', { result: t('guide.status.quote') })
  return t('guide.status', { result: planById(rec.planId)?.name ?? '' })
}

function ResultBody({ rec, price }: { rec: Recommendation; price: (n: number) => string }) {
  const { t } = useI18n()
  if (rec.kind === 'incomplete') return <p className="result-empty">{t('guide.result.empty')}</p>
  const reasons = rec.reasons.map((r) => {
    const plan = rec.kind === 'plan' ? planById(rec.planId) : undefined
    const n = r === 'volumeTier' ? (plan?.minSets ?? 25) : (plan?.maxDiameterIn ?? 22)
    return t(k(`guide.reason.${r}`), { n })
  })
  return (
    <>
      {rec.kind === 'plan' ? (
        <>
          <p className="result-label">{t('guide.result.plan')}</p>
          <p className="result-name">{planById(rec.planId)?.name}</p>
          <p className="result-price">{t('guide.result.priceNote', { price: price(planById(rec.planId)?.priceCad ?? 0) })}</p>
          <Ladder rec={rec} />
        </>
      ) : (
        <p className="result-name result-name-quote">{t('guide.result.quote')}</p>
      )}
      <p className="result-label">{t('guide.why')}</p>
      <ul className="reasons">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </>
  )
}
