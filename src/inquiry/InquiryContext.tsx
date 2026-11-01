import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState, type Dispatch, type ReactNode, type MutableRefObject } from 'react'
import { hasDraft, initialState, reducer, type Action } from './state'
import type { GuideHint, InquiryState, PlanChoice, Topic } from './types'

export interface OpenOptions {
  topic?: Topic
  plan?: PlanChoice
  hint?: GuideHint | null
}

interface InquiryApi {
  state: InquiryState
  dispatch: Dispatch<Action>
  isOpen: boolean
  /** True when the dialog was opened on top of earlier answers. */
  resumed: boolean
  clearResumed: () => void
  open: (opts?: OpenOptions) => void
  close: () => void
  triggerRef: MutableRefObject<HTMLElement | null>
}

const Ctx = createContext<InquiryApi | null>(null)

/**
 * Draft answers live in React memory only — never in storage, URLs or logs.
 * Closing the dialog keeps the draft for the current page session.
 */
export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [isOpen, setOpen] = useState(false)
  const [resumed, setResumed] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const open = useCallback((opts?: OpenOptions) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setResumed(hasDraft(stateRef.current))
    if (opts) dispatch({ type: 'preselect', ...opts })
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const clearResumed = useCallback(() => setResumed(false), [])

  const value = useMemo(
    () => ({ state, dispatch, isOpen, resumed, clearResumed, open, close, triggerRef }),
    [state, isOpen, resumed, clearResumed, open, close],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useInquiry(): InquiryApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useInquiry must be used inside InquiryProvider')
  return v
}
