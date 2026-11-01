import { useI18n, type Key } from '../i18n'

export function Faq() {
  const { t } = useI18n()
  return (
    <section id="faq" className="section" aria-labelledby="faq-h">
      <div className="container split">
        <header className="section-head" data-reveal>
          <h2 id="faq-h">{t('faq.h2')}</h2>
        </header>
        <div className="faq" data-reveal>
          {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => (
            <details key={n} name="faq">
              <summary>{t(`faq.${n}.q` as Key)}</summary>
              <p>{t(`faq.${n}.a` as Key)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
