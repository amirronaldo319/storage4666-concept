import { Button } from '../components/Button'
import { plans } from '../config/business'
import { useI18n, type Key } from '../i18n'
import { useInquiry } from '../inquiry/InquiryContext'

export function Plans() {
  const { t, price } = useI18n()
  const { open } = useInquiry()
  const individuals = plans.filter((p) => p.audience === 'individual')
  const garages = plans.filter((p) => p.audience === 'garage')
  return (
    <section id="forfaits" className="section section-tint" aria-labelledby="plans-h">
      <div className="container">
        <header className="section-head section-head-wide" data-reveal>
          <h2 id="plans-h">{t('plans.h2')}</h2>
          <p>{t('plans.lead')}</p>
        </header>

        <h3 className="subhead">{t('plans.individuals')}</h3>
        <div className="ledger" data-reveal>
          {individuals.map((p) => (
            <article key={p.id} className="ledger-col" aria-labelledby={`plan-${p.id}`}>
              <h4 id={`plan-${p.id}`}>{p.name}</h4>
              <p className="ledger-price"><span>{price(p.priceCad)}</span><small>{t('plans.per')}</small></p>
              <p className="ledger-desc">{t(`plans.${p.id}.desc` as Key)}</p>
              <ul>
                <li>{t('plans.row.storage')}</li>
                <li>{t('plans.row.diameter', { n: p.maxDiameterIn })}</li>
                <li>{p.pickupsIncluded ? t('plans.row.pickupN', { n: p.pickupsIncluded, km: p.radiusKm ?? 0 }) : t('plans.row.pickup0')}</li>
                <li>{t('plans.row.other')}</li>
              </ul>
              <Button onClick={() => open({ topic: 'tire-storage', plan: p.id })}>{t('plans.cta')}</Button>
            </article>
          ))}
        </div>

        <h3 className="subhead">{t('plans.garages')}</h3>
        <div className="table-wrap" data-reveal>
          <table className="plan-table">
            <thead>
              <tr>
                <th scope="col">{t('plans.garage.name')}</th>
                <th scope="col">{t('plans.garage.price')}</th>
                <th scope="col">{t('plans.garage.min')}</th>
                <th scope="col">{t('plans.garage.diameter')}</th>
                <th scope="col">{t('plans.garage.radius')}</th>
                <th scope="col"><span className="visually-hidden">{t('plans.garage.cta')}</span></th>
              </tr>
            </thead>
            <tbody>
              {garages.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.name}</th>
                  <td data-label={t('plans.garage.price')}>{price(p.priceCad)}</td>
                  <td data-label={t('plans.garage.min')}>{t('plans.garage.minValue', { n: p.minSets ?? 0 })}</td>
                  <td data-label={t('plans.garage.diameter')}>{p.maxDiameterIn} {t('plans.unit')}</td>
                  <td data-label={t('plans.garage.radius')}>{p.radiusKm} km</td>
                  <td>
                    <Button variant="ghost" className="btn-sm" aria-label={t('plans.garage.ctaLabel', { name: p.name })} onClick={() => open({ topic: 'pro-storage', plan: p.id })}>
                      {t('plans.garage.cta')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">{t('plans.garage.note')}</p>
        <p className="table-note">
          {t('plans.footnote')}{' '}
          <button type="button" className="link-button" onClick={() => open({ topic: 'unsure' })}>{t('plans.footnoteCta')}</button>
        </p>
      </div>
    </section>
  )
}
