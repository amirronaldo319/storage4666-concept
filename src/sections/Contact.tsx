import { Button } from '../components/Button'
import { ExternalLink } from '../components/ExternalLink'
import { AGENCY } from '../config/demo'
import { business, directionsUrl } from '../config/business'
import { useI18n } from '../i18n'
import { useInquiry } from '../inquiry/InquiryContext'

export function Contact() {
  const { t } = useI18n()
  const { open } = useInquiry()
  const a = business.address.value
  return (
    <>
      <section id="contact" className="section section-dark" aria-labelledby="contact-h">
        <div className="container split">
          <header className="section-head" data-reveal>
            <h2 id="contact-h">{t('cta.h2')}</h2>
            <p>{t('cta.body')}</p>
            <Button onClick={() => open()}>{t('nav.cta')}</Button>
          </header>
          <div className="contact-block" data-reveal>
            <h3>{t('contact.h2')}</h3>
            <p className="contact-lead">{t('contact.lead')}</p>
            <dl className="contact-list">
              <div>
                <dt>{t('contact.address')}</dt>
                <dd>
                  <address>{a.street}<br />{a.city} ({a.region}) {a.postal}</address>
                  <span className="tag">{t('contact.appointment')}</span>
                  <ExternalLink href={directionsUrl()}>{t('contact.directions')}</ExternalLink>
                </dd>
              </div>
              <div><dt>{t('contact.area')}</dt><dd>{t('contact.areaValue')}</dd></div>
              <div><dt>{t('contact.phone')}</dt><dd><a href={`tel:${business.phone.value.tel}`}>{business.phone.value.display}</a></dd></div>
              <div><dt>{t('contact.email')}</dt><dd><a href={`mailto:${business.email.value}`}>{business.email.value}</a></dd></div>
              <div><dt>{t('contact.hours')}</dt><dd>{t('contact.hoursValue')}</dd></div>
              <div><dt>{t('contact.facebook')}</dt><dd><ExternalLink href={business.facebook.value}>Facebook</ExternalLink></dd></div>
            </dl>
            <p className="map-note">{t('contact.mapNote')}</p>
            <p className="official">
              <ExternalLink href={`${business.currentSite}/prendre-rendez-vous/`}>{t('contact.official')}</ExternalLink>
              <small>{t('contact.officialHint')}</small>
            </p>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-row">
          <p className="footer-concept">
            {t('footer.concept').split('SitePilot')[0]}
            <ExternalLink href={AGENCY.url}>{t('footer.sitepilot')}</ExternalLink>
            {t('footer.concept').split('SitePilot')[1]}
          </p>
          <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </>
  )
}
