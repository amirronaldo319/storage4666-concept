import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fr, type Dict } from './fr'
import { en } from './en'

export type Lang = 'fr' | 'en'
export type Key = keyof Dict
export const dictionaries: Record<Lang, Dict> = { fr, en }
export const LOCALES: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA' }

const STORAGE_KEY = 'storage4666-concept:lang'

/** Only the language preference is ever persisted; storage may be unavailable. */
function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'fr' || v === 'en') return v
  } catch {
    /* storage blocked: fall through to default */
  }
  return 'fr'
}

function writeStoredLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
}

/** French typography: non-breaking spaces before high punctuation, inside « », and in "6 mois". */
function frenchSpacing(s: string): string {
  return s
    .replace(/ ([?!:;»%$])/g, ' $1')
    .replace(/« /g, '« ')
    .replace(/(\d) (mois|po|km|sets?|pneus|\$)/g, '$1 $2')
}

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  let s: string = dictionaries[lang][key]
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return lang === 'fr' ? frenchSpacing(s) : s
}

export function formatPrice(amount: number, lang: Lang): string {
  const whole = Number.isInteger(amount)
  return new Intl.NumberFormat(LOCALES[lang], {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount)
}

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Key, vars?: Record<string, string | number>) => string
  price: (amount: number) => string
}

const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initial ?? readStoredLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    writeStoredLang(l)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'meta.description'))
  }, [lang])

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      price: (n) => formatPrice(n, lang),
    }),
    [lang, setLang],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n must be used inside I18nProvider')
  return v
}
