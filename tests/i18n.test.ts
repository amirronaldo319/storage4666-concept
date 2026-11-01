import { describe, expect, it } from 'vitest'
import { dictionaries, translate } from '../src/i18n'

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',')

describe('translations', () => {
  it('French and English define exactly the same keys with the same placeholders', () => {
    const fr = Object.keys(dictionaries.fr).sort()
    const en = Object.keys(dictionaries.en).sort()
    expect(en).toEqual(fr)
    for (const key of fr as (keyof typeof dictionaries.fr)[]) {
      expect(placeholders(dictionaries.en[key]), key).toBe(placeholders(dictionaries.fr[key]))
      expect(dictionaries.en[key].trim(), key).not.toBe('')
    }
  })
  it('interpolates variables', () => {
    expect(translate('en', 'inq.stepOf', { n: 2, total: 4 })).toBe('Step 2 of 4')
  })
})
