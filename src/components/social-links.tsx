import { GraduationCap, Github, Linkedin, Mail } from 'lucide-react'
import { site } from '@/lib/site'

const socials = [
  { href: site.links.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: site.links.github, label: 'GitHub', Icon: Github },
  { href: site.links.scholar, label: 'Google Scholar', Icon: GraduationCap },
] as const

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {socials.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon size={16} />
          <span>{label}</span>
        </a>
      ))}
      <a
        href={`mailto:${site.email}`}
        aria-label="Email"
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Mail size={16} />
        <span>{site.email}</span>
      </a>
    </div>
  )
}
