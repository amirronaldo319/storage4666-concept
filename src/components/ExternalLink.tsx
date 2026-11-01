import type { ReactNode } from 'react'
import { useI18n } from '../i18n'

/** External links open in a new tab, without leaking the opener, and say so to assistive tech. */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const { t } = useI18n()
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> {t('a11y.external')}</span>
      <svg aria-hidden="true" className="ext-icon" viewBox="0 0 12 12" width="11" height="11"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    </a>
  )
}
