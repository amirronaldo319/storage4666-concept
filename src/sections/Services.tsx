import { Button } from '../components/Button'
import { useI18n, type Key } from '../i18n'
import { useInquiry, type OpenOptions } from '../inquiry/InquiryContext'

const SERVICES: readonly { n: 1 | 2 | 3 | 4 | 5; open?: OpenOptions }[] = [
  { n: 1 },
  { n: 2, open: { topic: 'pro-storage' } },
  { n: 3, open: { topic: 'pro-storage' } },
  { n: 4, open: { topic: 'tire-sale' } },
  { n: 5, open: { topic: 'other' } },
]

export function Services() {
  const { t } = useI18n()
  const { open } = useInquiry()
  return (
    <section id="services" className="section" aria-labelledby="services-h">
      <div className="container split">
        <header className="section-head" data-reveal>
          <h2 id="services-h">{t('services.h2')}</h2>
          <p>{t('services.lead')}</p>
        </header>
        <ol className="service-list" data-reveal>
          {SERVICES.map((s) => (
            <li key={s.n}>
              <span className="service-n" aria-hidden="true">{String(s.n).padStart(2, '0')}</span>
              <div>
                <h3>{t(`services.s${s.n}.title` as Key)}</h3>
                <p>{t(`services.s${s.n}.body` as Key)}</p>
              </div>
              {s.open ? (
                <Button variant="ghost" className="btn-sm" onClick={() => open(s.open)}>{t(`services.s${s.n}.cta` as Key)}</Button>
              ) : (
                <a className="btn btn-ghost btn-sm" href="#forfaits">{t('services.s1.cta')}</a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
