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
      },
      // Entry points for the crawler. Anything reachable by a link from these
      // is picked up automatically.
      pages: [
        { path: '/' },
        { path: '/cv' },
        { path: '/projects' },
        { path: '/publications' },
        { path: '/contact' },
      ],
    }),
    viteReact(),
  ],
})

export default config
