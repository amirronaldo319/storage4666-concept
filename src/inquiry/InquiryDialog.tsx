import { useEffect, useRef, useState, type FormEvent } from 'react'
import { LangSwitch } from '../components/LangSwitch'
import { business } from '../config/business'
import { useI18n, type Key } from '../i18n'
import { useInquiry } from './InquiryContext'
import { DemoNotice, StepContact, StepDates, StepNeed, StepReview } from './Steps'
import { hasDraft, todayLocal } from './state'
import { STEPS, type Step } from './types'

const stepKey = (s: Step) => `inq.step${s}` as Key

export function InquiryDialog() {
  const { t } = useI18n()
  const { state, dispatch, isOpen, close, resumed, clearResumed, triggerRef } = useInquiry()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const [announce, setAnnounce] = useState('')
  const [confirmingReset, setConfirmingReset] = useState(false)
  const done = state.status === 'done'

  // Open/close the native modal in sync with state.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (isOpen && !d.open) d.showModal()
    if (!isOpen && d.open) d.close()
  }, [isOpen])

  // Step changes: announce and move focus to the step heading (or final status).
  useEffect(() => {
    if (!isOpen) return
    setConfirmingReset(false)
    if (done) {
      setAnnounce(t('inq.done.title'))
      doneRef.current?.focus()
    } else {
      setAnnounce(t('inq.stepAnnounce', { n: state.step, total: STEPS.length, name: t(stepKey(state.step)) }))
      headingRef.current?.focus({ preventScroll: true })
    }
    // Language changes must not re-announce or move focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, state.step, done])

  // Validation failures: focus the first invalid control and announce the count.
  useEffect(() => {
    const n = Object.keys(state.errors).length
    if (!isOpen || n === 0) return
    setAnnounce(t('inq.errorsAnnounce', { n }))
    dialogRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.errors])

  const handleClosed = () => {
    close()
    const trigger = triggerRef.current
    if (trigger?.isConnected) trigger.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    clearResumed()
    if (state.step === 4) dispatch({ type: 'complete', today: todayLocal() })
    else dispatch({ type: 'next', today: todayLocal() })
  }

  // Keep the focused field visible when the on-screen keyboard opens.
  const keepVisible = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.target
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
      window.setTimeout(() => el.scrollIntoView({ block: 'center' }), 250)
    }
  }

  const restart = () => {
    dispatch({ type: 'reset' })
    clearResumed()
    setConfirmingReset(false)
  }

  const showResume = resumed && !done && hasDraft(state)

  return (
    <dialog
      ref={dialogRef}
      className="inq"
      aria-labelledby="inq-title"
      onClose={handleClosed}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
    >
      <div className="inq-shell">
        <header className="inq-head">
          <div className="inq-head-row">
            <p id="inq-title" className="inq-title">{t('inq.title')}</p>
            <LangSwitch />
            <button type="button" className="icon-btn" aria-label={t('inq.close')} onClick={() => dialogRef.current?.close()}>
              <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          {!done && (
            <div className="progress-wrap">
              <ol className="progress" aria-label={t('inq.progress')}>
                {STEPS.map((s) => (
                  <li key={s} className={s < state.step ? 'is-done' : s === state.step ? 'is-current' : ''} aria-current={s === state.step ? 'step' : undefined}>
                    <span className="visually-hidden">{t(stepKey(s))}</span>
                  </li>
                ))}
              </ol>
              <p className="progress-label">
                {t('inq.stepOf', { n: state.step, total: STEPS.length })} · <strong>{t(stepKey(state.step))}</strong>
              </p>
            </div>
          )}
        </header>

        <div className="visually-hidden" role="status" aria-live="polite">{announce}</div>

        {done ? (
          <div className="inq-body">
            <div className="done">
              <svg aria-hidden="true" viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" /><path d="m14 25 7 7 13-15" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h2 ref={doneRef} tabIndex={-1}>{t('inq.done.title')}</h2>
              <p>{t('inq.done.body')}</p>
              <p className="done-contact">
                <a href={`tel:${business.phone.value.tel}`}>{business.phone.value.display}</a> · <a href={`mailto:${business.email.value}`}>{business.email.value}</a>
              </p>
            </div>
            <footer className="inq-foot">
              <button type="button" className="btn btn-ghost" onClick={restart}>{t('inq.done.reset')}</button>
              <button type="button" className="btn btn-primary" onClick={() => dialogRef.current?.close()}>{t('inq.done.close')}</button>
            </footer>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} onFocusCapture={keepVisible} className="inq-form">
            <div className="inq-body">
              {showResume && (
                <div className="resume" role="group" aria-label={t('inq.resume.title')}>
                  <p><strong>{t('inq.resume.title')}.</strong> {t('inq.resume.body')}</p>
                  {confirmingReset ? (
                    <div className="resume-confirm">
                      <p>{t('inq.restart.confirm')}</p>
                      <button type="button" className="btn btn-danger btn-sm" onClick={restart}>{t('inq.restart.yes')}</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmingReset(false)}>{t('inq.restart.no')}</button>
                    </div>
                  ) : (
                    <button type="button" className="link-button" onClick={() => setConfirmingReset(true)}>{t('inq.resume.restart')}</button>
                  )}
                </div>
              )}
              {state.step < 3 && <DemoNotice />}
              <h2 ref={headingRef} tabIndex={-1} className="step-title">
                {t(`inq.s${state.step}.h` as Key)}
              </h2>
              {state.step === 1 && <StepNeed a={state.answers} errors={state.errors} dispatch={dispatch} />}
              {state.step === 2 && <StepDates a={state.answers} errors={state.errors} dispatch={dispatch} />}
              {state.step === 3 && <StepContact a={state.answers} errors={state.errors} dispatch={dispatch} />}
              {state.step === 4 && <StepReview a={state.answers} onEdit={(s) => dispatch({ type: 'goto', step: s })} />}
            </div>
            <footer className="inq-foot">
              {state.step > 1 ? (
                <button type="button" className="btn btn-ghost" onClick={() => { clearResumed(); dispatch({ type: 'back' }) }}>{t('inq.back')}</button>
              ) : (
                <span />
              )}
              <button type="submit" className="btn btn-primary">
                {state.step === 4 ? t('inq.finish') : t('inq.next')}
              </button>
            </footer>
          </form>
        )}
      </div>
    </dialog>
  )
}
