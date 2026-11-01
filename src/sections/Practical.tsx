import { useI18n, type Key } from '../i18n'

const MONTHS = ['N', 'D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O']

export function Practical() {
  const { t } = useI18n()
  return (
    <section id="pratique" className="section section-tint" aria-labelledby="info-h">
      <div className="container split">
        <header className="section-head" data-reveal>
          <h2 id="info-h">{t('info.h2')}</h2>
          <p>{t('info.lead')}</p>
          <div className="seasons">
            <h3>{t('info.seasons')}</h3>
            <div className="season-bar" aria-hidden="true">
              {MONTHS.map((m, i) => (
                <span key={i} className={i < 6 ? 'is-winter' : 'is-summer'}>{m}</span>
              ))}
            </div>
            <dl>
              <div><dt><span className="swatch swatch-winter" aria-hidden="true" />{t('info.winter')}</dt><dd>{t('info.winterDates')}</dd></div>
              <div><dt><span className="swatch swatch-summer" aria-hidden="true" />{t('info.summer')}</dt><dd>{t('info.summerDates')}</dd></div>
            </dl>
          </div>
        </header>
        <div className="info-list" data-reveal>
          {(['pickup', 'loss', 'refund', 'prices'] as const).map((id) => (
            <article key={id}>
              <h3>{t(`info.${id}.title` as Key)}</h3>
              <p>{t(`info.${id}.body` as Key)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
