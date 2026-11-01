import { useEffect } from 'react'

/**
 * Subtle entrance for [data-reveal] blocks. Content is visible by default;
 * hiding only starts once the observer is live, and never under reduced motion.
 */
export function useRevealOnScroll(): void {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduce || !('IntersectionObserver' in window)) return
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    targets.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight) el.classList.add('in')
      else io.observe(el)
    })
    document.documentElement.classList.add('reveal-ready')
    return () => {
      io.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])
}
