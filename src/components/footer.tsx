import { site } from '@/lib/site'
import { SocialLinks } from '@/components/social-links'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {site.name} — {site.affiliationShort}
        </p>
        <SocialLinks className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" />
      </div>
    </footer>
  )
}
