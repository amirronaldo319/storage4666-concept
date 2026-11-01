import { useEffect } from 'react'

const SPOT = '.service-list li, .facts li, .steps li, .faq details, .info-list li'

/** Feeds --mx/--my to spotlight cards so CSS can draw a pointer-following glow. Fine pointers only. */
export function useSpotlight(): void {
  useEffect(() => {
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (!fine || reduce) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(SPOT)
      if (!el) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
}
