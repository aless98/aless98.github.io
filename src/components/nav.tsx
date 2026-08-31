import { Link } from '@tanstack/react-router'

import { site } from '@/lib/site'

const links = [
  { to: '/', label: 'Home' },
  { to: '/cv', label: 'CV' },
  { to: '/publications', label: 'Publications' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
] as const

export function Nav() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-lg font-semibold tracking-tight text-foreground"
        >
          {site.shortName}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{
                className:
                  'px-3 py-2 text-sm font-medium text-foreground rounded-md bg-accent',
              }}
              activeOptions={{ exact: link.to === '/' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
