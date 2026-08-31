import { createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Orbit,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { site } from '@/lib/site'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

// The site is served as static files from GitHub Pages, so there is no backend
// to receive a form submission. Direct contact details instead.
const channels = [
  {
    Icon: Mail,
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'alessandro-albanesi',
    href: site.links.linkedin,
  },
  {
    Icon: Github,
    label: 'GitHub',
    value: 'aless98',
    href: site.links.github,
  },
  {
    Icon: GraduationCap,
    label: 'Google Scholar',
    value: 'Publications and citations',
    href: site.links.scholar,
  },
  {
    Icon: Orbit,
    label: 'ORCID',
    value: '0009-0007-3663-1882',
    href: site.links.orcid,
  },
] as const

function Contact() {
  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-semibold mb-2">Contact</h1>
        <p className="text-muted-foreground mb-8">
          For collaborations, research enquiries, or anything else, email is the
          most reliable way to reach me.
        </p>

        <div className="space-y-3 mb-10">
          {channels.map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={
                href.startsWith('mailto:') ? undefined : 'noopener noreferrer'
              }
              className="block group"
            >
              <Card className="transition-colors group-hover:border-foreground/30">
                <CardContent className="py-4 flex items-center gap-4">
                  <span className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted-foreground">
                      {label}
                    </span>
                    <span className="block font-medium truncate group-hover:underline">
                      {value}
                    </span>
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <h2 className="font-serif text-xl font-semibold mb-4">Affiliation</h2>
        <div className="space-y-3 text-muted-foreground">
          <p className="flex items-start gap-3">
            <Building2 size={18} className="mt-0.5 shrink-0" />
            <span>{site.affiliation}</span>
          </p>
          <p className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            <span>Milan, Italy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
