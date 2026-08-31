import { useEffect, useState } from 'react'

/** Height of the sticky header, in px. Matches `h-16` on the nav. */
const HEADER_HEIGHT = 64

/**
 * Tracks which section is currently in view, for highlighting the nav.
 *
 * Uses IntersectionObserver rather than comparing scroll offsets: sections here
 * vary a lot in height, and offset arithmetic drifts as content changes. The
 * observer's `rootMargin` narrows the viewport to a band just below the sticky
 * header, so a section becomes active as its top reaches that band.
 *
 * Returns `null` until a section is resolved, so nothing is highlighted during
 * server rendering or before hydration.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return

        // Several sections can share the band; the highest one wins.
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        )
        setActive(topmost.target.id)
      },
      {
        rootMargin: `-${HEADER_HEIGHT + 8}px 0px -60% 0px`,
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))

    // The final section is often too short to reach the observer band, so it
    // would never activate. At the bottom of the page, force it.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom) setActive(elements[elements.length - 1].id)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])

  return active
}
