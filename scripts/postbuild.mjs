/**
 * Post-build step: generate sitemap.xml from the pages actually emitted.
 *
 * TanStack Start's own sitemap is built from the prerender *crawl* set, which
 * includes the in-page `#anchor` links and the CV PDF. Those are not separate
 * documents, and listing them tells search engines the single page is several
 * duplicates. `prerender.filter` prevents them being rendered but does not
 * remove them from that sitemap, so the sitemap is derived here instead: from
 * the HTML files on disk, which is the ground truth of what was published.
 *
 * Redirect stubs (the old /cv, /projects, ... URLs) are excluded: they carry
 * `noindex` and a canonical pointing elsewhere, so they must not be advertised.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const CLIENT_DIR = 'dist/client'
const HOST = 'https://aless98.github.io'

async function findHtmlFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      found.push(...(await findHtmlFiles(full)))
    } else if (entry.name.endsWith('.html')) {
      found.push(full)
    }
  }
  return found
}

/** `dist/client/publications/foo/index.html` -> `/publications/foo/` */
function toUrlPath(file) {
  const rel = relative(CLIENT_DIR, file).split(sep).join('/')
  if (rel === 'index.html') return '/'
  return '/' + rel.replace(/index\.html$/, '')
}

const files = await findHtmlFiles(CLIENT_DIR)
const pages = []

for (const file of files) {
  const urlPath = toUrlPath(file)
  if (urlPath === '/404.html') continue

  const html = await readFile(file, 'utf8')
  // Skip redirect stubs and anything explicitly marked noindex.
  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) continue

  pages.push(urlPath)
}

pages.sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))

const lastmod = new Date().toISOString().slice(0, 10)
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.flatMap((p) => [
    '  <url>',
    `    <loc>${HOST}${p}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    p === '/' ? '    <priority>1.0</priority>' : '    <priority>0.7</priority>',
    '  </url>',
  ]),
  '</urlset>',
  '',
].join('\n')

await writeFile(join(CLIENT_DIR, 'sitemap.xml'), xml, 'utf8')
console.log(`[postbuild] sitemap.xml: ${pages.length} pages`)
for (const p of pages) console.log(`[postbuild]   ${p}`)
