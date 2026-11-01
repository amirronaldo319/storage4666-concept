import { useI18n, type Key } from '../i18n'

export function HowItWorks() {
  const { t } = useI18n()
  return (
    <section id="fonctionnement" className="section" aria-labelledby="how-h">
      <div className="container">
        <header className="section-head section-head-wide" data-reveal>
          <h2 id="how-h">{t('how.h2')}</h2>
          <p>{t('how.lead')}</p>
        </header>
        <ol className="steps" data-reveal>
          {([1, 2, 3] as const).map((n) => (
            <li key={n}>
              <span className="step-n" aria-hidden="true">{n}</span>
              <h3>{t(`how.s${n}.title` as Key)}</h3>
              <p>{t(`how.s${n}.body` as Key)}</p>
            </li>
          ))}
        </ol>
        <aside className="callout" data-reveal>
          <h3>{t('how.note.title')}</h3>
          <p>{t('how.note.body')}</p>
        </aside>
      </div>
    </section>
  )
}
