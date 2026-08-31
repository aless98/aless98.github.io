import { useEffect, useRef } from 'react'

/**
 * Animated backdrop for the hero: a slowly rotating 3D point cloud with a
 * rigid marker constellation inside it, projected to 2D.
 *
 * The motif is deliberate -- depth-sensed points plus a tracked rigid body is
 * what the research on this site actually does, so the decoration reinforces
 * the subject instead of competing with it.
 *
 * Behaviour it is careful about:
 *  - Draws one static frame and stops under `prefers-reduced-motion`.
 *  - Pauses entirely when scrolled out of view, so it is not burning battery
 *    while someone reads the CV further down the page.
 *  - Re-reads the theme each frame, so the dark-mode toggle takes effect
 *    without remounting.
 *  - `aria-hidden`, non-interactive, and low contrast: it must never interfere
 *    with the text sitting on top of it.
 *  - If canvas is unavailable the element is simply empty, leaving the normal
 *    page background.
 */

const POINT_COUNT = 150
/** Marker constellation: a rigid 5-point body, in arbitrary model units. */
const MARKERS: Array<[number, number, number]> = [
  [0, 0, 0],
  [0.62, 0.16, 0.05],
  [-0.55, 0.28, -0.08],
  [0.1, -0.6, 0.12],
  [-0.18, 0.66, 0.04],
]

type Point = { x: number; y: number; z: number; r: number }

function makePoints(rand: () => number): Array<Point> {
  return Array.from({ length: POINT_COUNT }, () => ({
    x: rand() * 2 - 1,
    y: rand() * 2 - 1,
    z: rand() * 2 - 1,
    r: 0.6 + rand() * 1.1,
  }))
}

/** Small deterministic PRNG, so the layout is identical on every load. */
function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches

    const points = makePoints(seeded(20260831))
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const project = (
      p: { x: number; y: number; z: number },
      angle: number,
      scale: number,
    ) => {
      // Rotate about Y, then a fixed tilt about X, then perspective-divide.
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const rx = p.x * cos - p.z * sin
      const rz = p.x * sin + p.z * cos
      const ry = p.y * 0.94 - rz * 0.34
      const depth = rz * 0.34 + p.y * 0.06
      const persp = 1 / (1.9 - depth * 0.55)
      return {
        sx: width / 2 + rx * scale * persp + pointer.x * 22,
        sy: height / 2 + ry * scale * persp + pointer.y * 14,
        // 0 = far, 1 = near. Drives size and opacity for depth cueing.
        d: (depth + 1) / 2,
      }
    }

    const draw = (t: number) => {
      const dark = document.documentElement.classList.contains('dark')
      const ink = dark ? '255,255,255' : '28,28,32'
      const accent = dark ? '120,200,255' : '20,120,190'

      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      const scale = Math.min(width, height) * 0.42
      const angle = t * 0.00006

      // --- point cloud ---
      const projected = points.map((p) => ({ p, ...project(p, angle, scale) }))
      for (const { p, sx, sy, d } of projected) {
        ctx.beginPath()
        ctx.arc(sx, sy, p.r * (0.45 + d * 0.85), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ink},${(0.05 + d * 0.16).toFixed(3)})`
        ctx.fill()
      }

      // --- marker constellation, drawn as a rigid tracked body ---
      const markers = MARKERS.map(([x, y, z]) =>
        project({ x, y, z }, angle, scale * 0.8),
      )
      ctx.lineWidth = 1
      for (let i = 0; i < markers.length; i++) {
        for (let j = i + 1; j < markers.length; j++) {
          const a = markers[i]
          const b = markers[j]
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.strokeStyle = `rgba(${accent},${(0.05 + ((a.d + b.d) / 2) * 0.13).toFixed(3)})`
          ctx.stroke()
        }
      }
      for (const m of markers) {
        ctx.beginPath()
        ctx.arc(m.sx, m.sy, 2.4 + m.d * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${accent},${(0.3 + m.d * 0.4).toFixed(3)})`
        ctx.fill()
      }
    }

    let frame = 0
    let running = false
    const loop = (t: number) => {
      draw(t)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduceMotion) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(frame)
    }

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }

    resize()
    draw(0)

    // Only animate while the hero is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    )
    observer.observe(canvas)

    window.addEventListener('resize', resize)
    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Fades the motif out toward the text and the section below, so it never
          fights the type for contrast. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  )
}
