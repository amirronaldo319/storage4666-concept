import { ScrubText } from '../components/ScrubText'
import { Guide } from '../guide/Guide'
import { useI18n } from '../i18n'

export function GuideSection() {
  const { t } = useI18n()
  return (
    <section id="guide" className="section section-dark" aria-labelledby="guide-h">
      <div className="container">
        <header className="section-head section-head-wide" data-reveal>
          <h2 id="guide-h">{t('guide.h2')}</h2>
          <p><ScrubText text={t('guide.lead')} /></p>
        </header>
        <div data-reveal><Guide /></div>
      </div>
    </section>
  )
}
