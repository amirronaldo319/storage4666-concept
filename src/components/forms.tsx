import { useId, type ReactNode, type HTMLInputTypeAttribute } from 'react'
import { useI18n } from '../i18n'

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="field-error">
      <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 4.2v4.6M8 11v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: HTMLInputTypeAttribute
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  hint?: string
  error?: string
  optional?: boolean
  multiline?: boolean
  min?: string
  name?: string
}

export function TextField({ label, value, onChange, type = 'text', autoComplete, inputMode, hint, error, optional, multiline, min, name }: TextFieldProps) {
  const { t } = useI18n()
  const id = useId()
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  const common = {
    id,
    name,
    value,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    autoComplete,
    className: 'control',
  } as const
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {optional && <span className="optional">{t('inq.optional')}</span>}
      </label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} inputMode={inputMode} min={min} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <ErrorLine id={errId}>{error}</ErrorLine>}
    </div>
  )
}

export interface Option<T extends string> {
  value: T
  label: string
  hint?: string
}

interface RadioGroupProps<T extends string> {
  legend: string
  name: string
  value: T | ''
  options: readonly Option<T>[]
  onChange: (v: T) => void
  hint?: string
  error?: string
  compact?: boolean
}

/** Selectable tiles built on native radios; selection is shown by a check mark, not colour alone. */
export function RadioGroup<T extends string>({ legend, name, value, options, onChange, hint, error, compact }: RadioGroupProps<T>) {
  const id = useId()
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className="field choice-set" aria-describedby={describedBy}>
      <legend>{legend}</legend>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      <div className={compact ? 'choices choices-compact' : 'choices'}>
        {options.map((o) => (
          <label key={o.value} className="choice">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              aria-invalid={error ? true : undefined}
              onChange={() => onChange(o.value)}
            />
            <span className="choice-mark" aria-hidden="true">
              <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2 6.4 4.8 9 10 3.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="choice-text">
              <span>{o.label}</span>
              {o.hint && <small>{o.hint}</small>}
            </span>
          </label>
        ))}
      </div>
      {error && <ErrorLine id={errId}>{error}</ErrorLine>}
    </fieldset>
  )
}

interface SelectFieldProps<T extends string> {
  label: string
  value: T
  options: readonly Option<T>[]
  onChange: (v: T) => void
}

export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="control" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
