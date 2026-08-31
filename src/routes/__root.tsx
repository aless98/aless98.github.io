import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { site } from '@/lib/site'
import { themeInitScript } from '@/lib/theme'
import '../styles.css'

const TITLE = `${site.name} — XR & Computer Vision for Neurosurgery`
const DESCRIPTION =
  `${site.name} is a PhD student at Politecnico di Milano working on extended ` +
  `reality, computer vision, and surgical navigation for image-guided surgery. ` +
  `Publications, research projects, and CV.`
const OG_IMAGE = `${site.url}/og-image.png`

/**
 * Tells search engines that this site is one person, and links the identities
 * they can cross-check (ORCID, Scholar, GitHub, LinkedIn). This is what lets a
 * search for the name surface the site with the right context attached.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  image: OG_IMAGE,
  email: `mailto:${site.email}`,
  jobTitle: 'PhD Student in Bioengineering',
  affiliation: {
    '@type': 'CollegeOrUniversity',
    name: 'Politecnico di Milano',
    department: {
      '@type': 'Organization',
      name: 'Department of Electronics, Information and Bioengineering (DEIB)',
    },
  },
  knowsAbout: [
    'Extended Reality',
    'Augmented Reality',
    'Computer Vision',
    'Surgical Navigation',
    'Image-Guided Surgery',
    'Medical Image Analysis',
    'Deep Learning',
  ],
  sameAs: [
    site.links.orcid,
    site.links.scholar,
    site.links.github,
    site.links.linkedin,
  ],
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { name: 'author', content: site.name },

      // Open Graph — link previews on LinkedIn, Slack, WhatsApp, etc.
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: `${site.url}/` },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${site.name} — ${site.role}` },
      { property: 'og:locale', content: 'en_GB' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },

      // Light and dark are both supported, so let the browser chrome match.
      { name: 'color-scheme', content: 'light dark' },
    ],
    links: [
      { rel: 'canonical', href: `${site.url}/` },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    scripts: [
      // Must run before first paint: resolves the theme so dark-mode visitors
      // never see a white flash, and flags the document as JS-capable, which
      // is what enables the scroll-reveal styles.
      { children: themeInitScript },
      {
        type: 'application/ld+json',
        children: JSON.stringify(personSchema),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
