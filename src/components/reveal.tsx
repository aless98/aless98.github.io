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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
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
