import { planById, plans, type Plan } from '../config/business'
import { RadioGroup, SelectField, TextField, type Option } from '../components/forms'
import { LOCALES, useI18n, type Key } from '../i18n'
import { formatLocalDate } from './dates'
import { todayLocal } from './state'
import type { Action } from './state'
import type { Answers, Duration, ContactMethod, Errors, GuideHint, PlanChoice, StartMode, Step, Topic } from './types'
import type { Dispatch } from 'react'

const k = (s: string) => s as Key

interface StepProps {
  a: Answers
  errors: Errors
  dispatch: Dispatch<Action>
}

const set = <F extends keyof Answers>(dispatch: Dispatch<Action>, field: F, value: Answers[F]) =>
  dispatch({ type: 'set', field, value })

export function useHintLine() {
  const { t } = useI18n()
  return (h: GuideHint) =>
    t('inq.hint.line', {
      audience: t(k(`opt.audience.${h.audience}`)),
      diameter: t(k(`opt.diameter.${h.diameter}`)),
      sets: h.sets,
      pickup: t(k(`opt.pickup.${h.pickup}`)),
    })
}

export function DemoNotice() {
  const { t } = useI18n()
  return (
    <div className="notice" role="note">
      <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <p>
        <strong>{t('inq.demo.title')}.</strong> {t('inq.demo.body')}
      </p>
    </div>
  )
}

export function StepNeed({ a, errors, dispatch }: StepProps) {
  const { t, price } = useI18n()
  const hintLine = useHintLine()
  const topics: Option<Topic>[] = (['tire-storage', 'pro-storage', 'tire-sale', 'other', 'unsure'] as const).map((v) => ({
    value: v,
    label: t(k(`inq.topic.${v}`)),
  }))
  const audience: Plan['audience'] | null = a.topic === 'tire-storage' ? 'individual' : a.topic === 'pro-storage' ? 'garage' : null
  const planOptions: Option<PlanChoice>[] = audience
    ? [
        ...plans
          .filter((p) => p.audience === audience)
          .map((p) => ({ value: p.id as PlanChoice, label: t('inq.plan.line', { name: p.name, price: price(p.priceCad) }) })),
        { value: 'unsure', label: t('inq.plan.unsure') },
      ]
    : []
  const onTopic = (topic: Topic) => {
    set(dispatch, 'topic', topic)
    const next: Plan['audience'] | null = topic === 'tire-storage' ? 'individual' : topic === 'pro-storage' ? 'garage' : null
    const current = planById(a.plan)
    if (!next || (current && current.audience !== next)) set(dispatch, 'plan', 'unsure')
  }
  return (
    <>
      {a.hint && (
        <div className="estimate-chip">
          <strong>{t('inq.hint.title')}</strong>
          <span>{hintLine(a.hint)}</span>
          <small>{t('inq.hint.note')}</small>
        </div>
      )}
      <RadioGroup legend={t('inq.topic.legend')} name="topic" value={a.topic} options={topics} onChange={onTopic} error={errors.topic && t('err.topic')} />
      {audience && (
        <RadioGroup legend={t('inq.plan.legend')} name="plan" value={a.plan} options={planOptions} onChange={(v) => set(dispatch, 'plan', v)} hint={t('inq.plan.hint')} />
      )}
      <TextField label={t('inq.details.label')} hint={t('inq.details.hint')} value={a.details} onChange={(v) => set(dispatch, 'details', v)} multiline optional name="details" />
    </>
  )
}

export function StepDates({ a, errors, dispatch }: StepProps) {
  const { t } = useI18n()
  const modes: Option<StartMode>[] = (['date', 'flexible', 'unsure'] as const).map((v) => ({ value: v, label: t(k(`inq.start.${v}`)) }))
  const durations: Option<Duration>[] = (['6m', 'other', 'unsure'] as const).map((v) => ({ value: v, label: t(k(`inq.duration.${v}`)) }))
  const dateError = errors.startDate && t(k(`err.startDate.${errors.startDate}`))
  return (
    <>
      <RadioGroup legend={t('inq.start.legend')} name="startMode" value={a.startMode} options={modes} onChange={(v) => set(dispatch, 'startMode', v)} error={errors.startMode && t('err.startMode')} />
      {a.startMode === 'date' && (
        <TextField label={t('inq.date.label')} hint={t('inq.date.hint')} type="date" min={todayLocal()} value={a.startDate} onChange={(v) => set(dispatch, 'startDate', v)} error={dateError} name="start-date" />
      )}
      <SelectField label={t('inq.duration.label')} value={a.duration} options={durations} onChange={(v) => set(dispatch, 'duration', v)} />
    </>
  )
}

export function StepContact({ a, errors, dispatch }: StepProps) {
  const { t } = useI18n()
  const methods: Option<ContactMethod>[] = [
    { value: 'email', label: t('inq.method.email') },
    { value: 'phone', label: t('inq.method.phone') },
  ]
  const phoneError = errors.phone && t(k(`err.phone.${errors.phone}`))
  const fillSample = () => {
    set(dispatch, 'name', 'Alex Exemple')
    set(dispatch, 'email', 'alex@example.com')
  }
  return (
    <>
      <DemoNotice />
      <p className="step-aside">
        {t('inq.s3.demoNote')}{' '}
        <button type="button" className="link-button" onClick={fillSample}>{t('inq.sample')}</button>
      </p>
      <TextField label={t('inq.name.label')} name="name" autoComplete="name" value={a.name} onChange={(v) => set(dispatch, 'name', v)} error={errors.name && t('err.name.required')} />
      <TextField label={t('inq.email.label')} name="email" type="email" inputMode="email" autoComplete="email" value={a.email} onChange={(v) => set(dispatch, 'email', v)} error={errors.email && t(k(`err.email.${errors.email}`))} />
      <RadioGroup legend={t('inq.method.legend')} name="method" value={a.method} options={methods} onChange={(v) => set(dispatch, 'method', v)} compact />
      <TextField label={t('inq.phone.label')} name="phone" type="tel" inputMode="tel" autoComplete="tel" optional={a.method !== 'phone'} hint={a.method === 'phone' ? t('inq.method.phoneNeeded') : t('inq.phone.hint')} value={a.phone} onChange={(v) => set(dispatch, 'phone', v)} error={phoneError} />
      <TextField label={t('inq.message.label')} hint={t('inq.message.hint')} value={a.message} onChange={(v) => set(dispatch, 'message', v)} multiline optional name="message" />
    </>
  )
}

interface ReviewProps {
  a: Answers
  onEdit: (step: Step) => void
}

export function StepReview({ a, onEdit }: ReviewProps) {
  const { t, lang } = useI18n()
  const hintLine = useHintLine()
  const empty = t('inq.review.empty')
  const plan = a.plan === 'unsure' ? t('inq.plan.unsure') : (planById(a.plan)?.name ?? empty)
  const start =
    a.startMode === 'date' ? formatLocalDate(a.startDate, LOCALES[lang]) : a.startMode ? t(k(`inq.start.${a.startMode}`)) : empty
  type Row = [label: string, value: string]
  const sections: { step: Step; title: string; rows: Row[] }[] = [
    {
      step: 1,
      title: t('inq.step1'),
      rows: [
        [t('inq.review.topic'), a.topic ? t(k(`inq.topic.${a.topic}`)) : empty],
        ...(a.topic === 'tire-storage' || a.topic === 'pro-storage' ? ([[t('inq.review.plan'), plan]] as Row[]) : []),
        ...(a.hint ? ([[t('inq.review.estimate'), hintLine(a.hint)]] as Row[]) : []),
        [t('inq.review.details'), a.details.trim() || empty],
      ],
    },
    { step: 2, title: t('inq.step2'), rows: [[t('inq.review.start'), start], [t('inq.review.duration'), t(k(`inq.duration.${a.duration}`))]] },
    {
      step: 3,
      title: t('inq.step3'),
      rows: [
        [t('inq.review.name'), a.name.trim() || empty],
        [t('inq.review.email'), a.email.trim() || empty],
        [t('inq.review.phone'), a.phone.trim() || empty],
        [t('inq.review.method'), t(k(`inq.method.${a.method}`))],
        [t('inq.review.message'), a.message.trim() || empty],
      ],
    },
  ]
  return (
    <>
      <p className="step-aside">{t('inq.s4.lead')}</p>
      {sections.map((s) => (
        <section key={s.step} className="review-block">
          <header>
            <h3>{s.title}</h3>
            <button type="button" className="link-button" aria-label={t('inq.review.editLabel', { section: s.title })} onClick={() => onEdit(s.step)}>
              {t('inq.review.edit')}
            </button>
          </header>
          <dl>
            {s.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <div className="notice notice-strong" role="note">
        <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10 9v5M10 6v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <p>{t('inq.review.notice')}</p>
      </div>
    </>
  )
}
