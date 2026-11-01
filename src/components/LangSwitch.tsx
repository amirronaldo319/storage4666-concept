import { useI18n, type Lang } from '../i18n'

const LANGS: readonly { code: Lang; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
]

export function LangSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lang" role="group" aria-label={t('a11y.langGroup')}>
      {LANGS.map((l) => (
        <button key={l.code} type="button" lang={l.code} aria-pressed={lang === l.code} aria-label={`${l.label} — ${l.name}`} onClick={() => setLang(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  )
}
