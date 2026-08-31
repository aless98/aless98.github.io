import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Fades and lifts its children into view once, on first entry.
 *
 * The hidden state lives in CSS behind a `.js` class set by the head script, so
 * content is fully visible when JavaScript is unavailable. That matters here:
 * the whole site is prerendered for search engines, and gating visibility on JS
 * would throw that away.
 *
 * One-shot by design -- the observer disconnects after revealing, so nothing
 * re-animates when scrolling back up.
 */
/** Set once any reveal observer fires, proving observers work in this page. */
let revealProbeSettled = false

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  /** Stagger, in ms, for revealing siblings in sequence. */
  delay?: number
  as?: 'div' | 'section' | 'li'
  /** Forwarded to the element -- the section anchors depend on it. */
  id?: string
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer support, or reduced motion: show immediately.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-visible')
      return
    }

    // Already on screen at mount -- e.g. the landing section after following
    // a `/#cv` style anchor. Reveal straight away rather than waiting a frame.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      revealProbeSettled = true
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        revealProbeSettled = true
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    observer.observe(el)

    // Safety net. Reveal is opt-out styling: if observer callbacks never
    // arrive, every section stays at opacity 0 and the page reads as blank.
    // Rather than trust that never happens, probe once and disable the reveal
    // styling wholesale if the observer proves unreliable.
    const probeTimer = window.setTimeout(() => {
      if (!revealProbeSettled) {
        document.documentElement.classList.add('reveal-off')
      }
    }, 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(probeTimer)
    }
  }, [])

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
