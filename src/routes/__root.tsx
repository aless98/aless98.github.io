import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { site } from '@/lib/site'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${site.name} — XR & Computer Vision for Neurosurgery`,
      },
      {
        name: 'description',
        content: `Personal academic site of ${site.name}: research in extended reality, computer vision, and surgical navigation for neurosurgery, with publications, projects, and CV.`,
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
