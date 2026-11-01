import { useEffect, useRef, useState } from 'react'
import { useI18n, type Key } from '../i18n'
import { useInquiry } from '../inquiry/InquiryContext'
import { LangSwitch } from './LangSwitch'
import { Wordmark } from './Wordmark'

const NAV: readonly { id: string; key: Key }[] = [
  { id: 'services', key: 'nav.services' },
  { id: 'forfaits', key: 'nav.plans' },
  { id: 'guide', key: 'nav.guide' },
  { id: 'faq', key: 'nav.faq' },
  { id: 'contact', key: 'nav.contact' },
]

export function Header() {
  const { t } = useI18n()
  const { open } = useInquiry()
  const [menuOpen, setMenuOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    navRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container header-row">
        <a href="#top" className="brand" aria-label="Storage4666" onClick={() => setMenuOpen(false)}>
          <Wordmark />
        </a>
        <nav id="main-nav" ref={navRef} className="nav" data-open={menuOpen} aria-label={t('a11y.mainNav')}>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setMenuOpen(false)}>{t(n.key)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-tools">
          <LangSwitch />
          <button type="button" className="btn btn-primary header-cta" onClick={() => open()}>
            <span className="cta-long">{t('nav.cta')}</span>
            <span className="cta-short">{t('nav.ctaShort')}</span>
          </button>
          <button
            ref={btnRef}
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? t('a11y.menuClose') : t('a11y.menuOpen')}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg aria-hidden="true" viewBox="0 0 22 22" width="22" height="22">
              {menuOpen ? <path d="m5 5 12 12M17 5 5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
