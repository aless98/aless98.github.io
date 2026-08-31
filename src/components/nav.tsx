import { useLocation } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { sections, site } from '@/lib/site'
import { useActiveSection } from '@/lib/use-active-section'
import { ThemeToggle } from '@/components/theme-toggle'

export function Nav() {
  const { pathname } = useLocation()
  // The sections only exist on the home page. Publication permalinks share this
  // header, so from there the links must navigate home first.
  const isHome = pathname === '/'
  const active = useActiveSection(isHome ? sections.map((s) => s.id) : [])

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-foreground shrink-0"
        >
          {site.shortName}
        </a>
        {/* Plain anchors, so the jump works before hydration and without JS.
            Scrolls horizontally rather than wrapping on narrow screens. */}
        <nav
          aria-label="Sections"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const isActive = isHome && active === section.id
            return (
              <a
                key={section.id}
                href={isHome ? `#${section.id}` : `/#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                {section.label}
              </a>
            )
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
