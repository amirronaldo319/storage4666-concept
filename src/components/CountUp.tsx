import { useEffect, useRef, useState } from 'react'

/** Counts the first integer in `text` up from 0 once it scrolls into view. Final text renders first, and with reduced motion. */
export function CountUp({ text }: { text: string }) {
  const target = Number(/\d+/.exec(text)?.[0] ?? 0)
  const hasNumber = /\d+/.test(text)
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (!hasNumber || !el || reduce || !('IntersectionObserver' in window)) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1100)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
        else setN(null)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [hasNumber, target])

  if (!hasNumber || n === null) return <span ref={ref}>{text}</span>
  return <span ref={ref} className="count" aria-label={text}>{text.replace(/\d+/, String(n))}</span>
}
