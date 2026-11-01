import { useEffect } from 'react'
import { Header } from './components/Header'
import { I18nProvider, useI18n } from './i18n'
import { InquiryProvider } from './inquiry/InquiryContext'
import { InquiryDialog } from './inquiry/InquiryDialog'
import { Contact } from './sections/Contact'
import { Faq } from './sections/Faq'
import { GuideSection } from './sections/GuideSection'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { Plans } from './sections/Plans'
import { Practical } from './sections/Practical'
import { Services } from './sections/Services'
import { useRevealOnScroll } from './useReveal'

function Page() {
  const { t } = useI18n()
  useRevealOnScroll()
  return (
    <>
      <a className="skip-link" href="#main">{t('a11y.skip')}</a>
      <div className="demo-banner" role="note">{t('demo.banner')}</div>
      <Header />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Services />
        <Plans />
        <GuideSection />
        <HowItWorks />
        <Practical />
        <Faq />
        <Contact />
      </main>
      <InquiryDialog />
    </>
  )
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])
  return (
    <I18nProvider>
      <InquiryProvider>
        <Page />
      </InquiryProvider>
    </I18nProvider>
  )
}
