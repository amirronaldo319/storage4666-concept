import { useEffect, useRef } from 'react'

const GAP = 30
const REACH = 110

/** Decorative dot field that swells and drifts away from the pointer. Fine pointers only; static-free (renders nothing) otherwise. */
export function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ok = window.matchMedia?.('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches ?? false
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !ok) return
    const host = canvas.parentElement as HTMLElement
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const mouse = { x: -999, y: -999, active: false }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const size = () => {
      w = host.clientWidth
      h = host.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = getComputedStyle(canvas!).color
      let moving = false
      for (let x = GAP / 2; x < w; x += GAP) {
        for (let y = GAP / 2; y < h; y += GAP) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d = Math.hypot(dx, dy)
          const k = mouse.active && d < REACH ? 1 - d / REACH : 0
          if (k > 0) moving = true
          const push = k * 10
          const px = x + (d ? (dx / d) * push : 0)
          const py = y + (d ? (dy / d) * push : 0)
          ctx!.beginPath()
          ctx!.arc(px, py, 1.3 + k * 2.6, 0, Math.PI * 2)
          ctx!.fill()
        }
      }
      raf = moving && visible ? requestAnimationFrame(draw) : 0
    }

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw)
    }
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = mouse.y > -REACH && mouse.y < r.height + REACH
      kick()
    }
    const onLeave = () => {
      mouse.active = false
      kick()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    })
    const ro = new ResizeObserver(size)
    io.observe(host)
    ro.observe(host)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    size()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="dot-grid" aria-hidden="true" />
}
