import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import contentCollections from '@content-collections/vite'

// Deployed as a fully static site to GitHub Pages, which serves files only --
// no SSR, no functions. Every route is therefore prerendered to real HTML at
// build time: `crawlLinks` walks the app from `/`, so the publication detail
// pages are discovered from the publications index without being listed here.
const config = defineConfig({
  // Served from the root of aless98.github.io, so no base path is needed.
  base: '/',
  plugins: [
    contentCollections(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // Emit `about/index.html` rather than `about.html`, so GitHub Pages
        // resolves extensionless URLs like `/projects` without a redirect.
        autoSubfolderIndex: true,
        retryCount: 1,
        // The crawler follows every link, including the in-page anchors and the
        // CV download. Those are not separate documents: prerendering them is
        // wasted work, and listing them in the sitemap tells search engines the
        // single page is seven duplicates.
        filter: ({ path }: { path: string }) =>
          !path.includes('#') && !path.includes('.pdf'),
      },
      // The site is a single page; `/` is the only entry point. The nine
      // publication permalinks are reached by the crawler via the "Permalink"
      // links in the publications section, so they need no listing here.
      pages: [{ path: '/' }],
    }),
    viteReact(),
  ],
})

export default config
