/** Local calendar date as YYYY-MM-DD. Never routes through UTC (toISOString shifts the day). */
export function toLocalISODate(d: Date): string {
  const y = String(d.getFullYear()).padStart(4, '0')
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** True for a real calendar date written as YYYY-MM-DD. */
export function isValidISODate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d
}

/** Formats a stored date for display in the given locale, as a local date (no UTC shift). */
export function formatLocalDate(value: string, locale: string): string {
  if (!isValidISODate(value)) return value
  const [y, m, d] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(y, m - 1, d))
}
