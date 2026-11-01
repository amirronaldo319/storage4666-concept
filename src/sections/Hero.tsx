import { Fragment } from 'react'
import { Button } from '../components/Button'
import { CountUp } from '../components/CountUp'
import { HeroArt } from '../components/HeroArt'
import { useI18n, type Key } from '../i18n'
import { useInquiry } from '../inquiry/InquiryContext'

const FACTS = [1, 2, 3, 4] as const

export function Hero() {
  const { t } = useI18n()
  const { open } = useInquiry()
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 id="hero-title" aria-label={t('hero.h1')}>
            {t('hero.h1').split(' ').map((w, i) => (
              <Fragment key={i}>
                <span className="word" aria-hidden="true">
                  <span style={{ ['--w' as string]: i }}>{w}</span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>
          <p className="lead">{t('hero.lead')}</p>
          <div className="cta-row">
            <Button onClick={() => open()}>{t('hero.ctaPrimary')}</Button>
            <a className="btn btn-ghost" href="#guide">{t('hero.ctaSecondary')}</a>
          </div>
        </div>
        <figure className="hero-art">
          <HeroArt />
          <figcaption>{t('hero.caption')}</figcaption>
        </figure>
      </div>
      <ul className="container facts">
        {FACTS.map((n) => (
          <li key={n}>
            <strong>{n === 2 ? <CountUp text={t(`hero.fact${n}.value` as Key)} /> : t(`hero.fact${n}.value` as Key)}</strong>
            <span>{t(`hero.fact${n}.label` as Key)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
