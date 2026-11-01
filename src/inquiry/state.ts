import { toLocalISODate } from './dates'
import { firstInvalidStep, validateStep } from './validate'
import type { Answers, FieldKey, GuideHint, InquiryState, PlanChoice, Step, Topic } from './types'

export const emptyAnswers = (): Answers => ({
  topic: '',
  plan: 'unsure',
  details: '',
  hint: null,
  startMode: '',
  startDate: '',
  duration: 'unsure',
  name: '',
  email: '',
  phone: '',
  method: 'email',
  message: '',
})

export const initialState = (): InquiryState => ({
  answers: emptyAnswers(),
  step: 1,
  status: 'draft',
  errors: {},
})

export type Action =
  | { type: 'set'; field: keyof Answers; value: Answers[keyof Answers] }
  | { type: 'next'; today: string }
  | { type: 'back' }
  | { type: 'goto'; step: Step }
  | { type: 'preselect'; topic?: Topic; plan?: PlanChoice; hint?: GuideHint | null }
  | { type: 'complete'; today: string }
  | { type: 'reset' }

const ERROR_FIELDS: Partial<Record<keyof Answers, FieldKey[]>> = {
  topic: ['topic'],
  startMode: ['startMode', 'startDate'],
  startDate: ['startDate'],
  name: ['name'],
  email: ['email'],
  phone: ['phone'],
  method: ['phone'],
}

/** True when the visitor has entered anything worth resuming. */
export function hasDraft(s: InquiryState): boolean {
  if (s.status === 'done') return false
  const e = emptyAnswers()
  const a = s.answers
  return (
    a.topic !== e.topic ||
    a.plan !== e.plan ||
    a.hint !== null ||
    a.details.trim() !== '' ||
    a.startMode !== '' ||
    a.startDate !== '' ||
    a.duration !== e.duration ||
    a.name.trim() !== '' ||
    a.email.trim() !== '' ||
    a.phone.trim() !== '' ||
    a.message.trim() !== '' ||
    a.method !== e.method ||
    s.step !== 1
  )
}

export function reducer(state: InquiryState, action: Action): InquiryState {
  switch (action.type) {
    case 'set': {
      if (state.status === 'done') return state
      const answers = { ...state.answers, [action.field]: action.value } as Answers
      const errors = { ...state.errors }
      for (const key of ERROR_FIELDS[action.field] ?? []) delete errors[key]
      return { ...state, answers, errors }
    }
    case 'next': {
      if (state.status === 'done' || state.step === 4) return state
      const errors = validateStep(state.step, state.answers, action.today)
      if (Object.keys(errors).length > 0) return { ...state, errors }
      return { ...state, errors: {}, step: (state.step + 1) as Step }
    }
    case 'back':
      if (state.step === 1) return state
      return { ...state, errors: {}, step: (state.step - 1) as Step }
    case 'goto':
      return { ...state, errors: {}, step: action.step }
    case 'preselect': {
      if (state.status === 'done') return state
      const answers: Answers = {
        ...state.answers,
        ...(action.topic !== undefined && { topic: action.topic }),
        ...(action.plan !== undefined && { plan: action.plan }),
        ...(action.hint !== undefined && { hint: action.hint }),
      }
      return { ...state, answers, errors: {}, step: 1 }
    }
    case 'complete': {
      // Guard: completing twice is a no-op.
      if (state.status === 'done') return state
      const invalid = firstInvalidStep(state.answers, action.today)
      if (invalid) return { ...state, step: invalid.step, errors: invalid.errors }
      return { ...state, errors: {}, status: 'done' }
    }
    case 'reset':
      return initialState()
  }
}

export const todayLocal = (): string => toLocalISODate(new Date())
