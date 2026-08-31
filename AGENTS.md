# AGENTS.md

This document orients AI agents and developers working on this codebase.

## Project Overview

The personal academic website of **Alessandro Albanesi** — PhD student in the Bioengineering Group (DEIB) at Politecnico di Milano, working on XR/AR and computer vision for neurosurgical procedures, and a Surgical Navigation Software Engineer consulting for XRlabs. Built with TanStack Start, prerendered to static HTML, and deployed to GitHub Pages.

Publications, projects, and news in `content/` are **real**. The `content/jobs` and `content/education` entries are still template placeholders and need replacing.

Identity and external profile links (name, role, email, GitHub, LinkedIn, Google Scholar) live in one place: `src/lib/site.ts`. Edit them there — the nav, footer, home page, and document metadata all read from it.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 (file-based routing) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + custom components in `src/components/ui/` |
| Content | Content Collections (type-safe markdown in `content/`) |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) |

## Directory Structure

```
content/
  jobs/           # Work experience entries (used on /cv)
  education/      # Education entries (used on /cv)
  publications/   # Research papers (used on /publications)
  projects/       # Research projects (used on /projects, filterable by category)
  news/           # Short news items shown on the homepage
src/
  components/
    nav.tsx       # Site-wide navigation header, rendered from __root.tsx
    ui/           # Radix-based primitives: card, badge, checkbox, hover-card, separator
  routes/
    __root.tsx        # Root layout: renders Nav + page content
    index.tsx          # Home: bio + news feed
    cv.tsx              # CV: work experience (content/jobs) + education (content/education)
    projects.tsx        # Research projects gallery with category filter
    publications/
      index.tsx         # Publications list
      $slug.tsx         # Publication detail page
    contact.tsx         # Contact details (no form -- static hosting has no backend)
public/
  .nojekyll             # Stops GitHub Pages running Jekyll over the output
  404.html              # Static not-found page (inline CSS, no asset deps)
  projects/             # Project card images and video
content-collections.ts  # Zod schemas for all content collections
```

## Content Collections

Each collection is defined in `content-collections.ts` and populated from markdown files with frontmatter in `content/`:

- `jobs` — jobTitle, company, location, startDate, endDate, summary, tags, content
- `education` — school, summary, startDate, endDate, tags, content
- `publications` — title, date, summary, authors, venue, tags, pdfUrl?, codeUrl?, content
- `projects` — title, description, category, tags, github?, liveUrl?, image?, content
- `news` — title, date, content

To add new content, drop a new markdown file into the relevant `content/*` directory following the existing frontmatter shape — no code changes needed.

## Conventions

- Routes are file-based under `src/routes/`; a folder with `index.tsx` + `$slug.tsx` maps to `/publications` and `/publications/$slug`.
- Never hard-code the site owner's name, email, or profile URLs in a component — import `site` from `@/lib/site`.
- A publication's or project's slug is its markdown filename (`_meta.path`), so renaming a file changes its URL.
- Import paths use the `@/` alias for `src/*`.
- Styling uses Tailwind utility classes and the `cn()` helper (`src/lib/utils.ts`) for conditional classes.
- Theme tokens (colors, radius) live in `src/styles.css` as CSS custom properties; `--font-serif` is defined there for headings.
- The projects page filters client-side by `category` — add a new category value to a project's frontmatter and it appears automatically as a filter pill.
- Project card images live in `public/projects/` and are referenced from frontmatter as `image: "/projects/<name>.webp"`.
  They render as a 16:9 banner at the top of the card (`object-cover`). Target **1200×675 WebP**; keep them well
  under ~100 KB. `image` is optional — a project without one renders as a text-only card, so a missing file never
  produces a broken image.
- When a source image is not 16:9, pad rather than crop: scale it to *contain* on a 1200×675 canvas over a blurred,
  scaled-to-*cover* copy of itself (or the figure's own background colour, for white-ground journal figures).
  That fills the sides without cutting off content.
- A project may instead set `video` (e.g. `/projects/<name>.mp4`) to play a looping, muted, autoplaying clip in
  place of the still. When both are set, `image` becomes the video's poster frame. Encode as H.264 MP4, 800×450,
  no audio track — a demo GIF converts to roughly 5% of its original size this way. Keep clips short and silent;
  the card gives them no controls.

## Development Commands

```bash
npm run dev        # Dev server on :3000
npm run build      # Prerender the whole site to dist/client
npm run typecheck  # tsc --noEmit
```

## Deployment

The site is **fully static**. `npm run build` prerenders every route to real HTML
under `dist/client` -- `crawlLinks` walks outward from the entry pages listed in
`vite.config.ts`, so publication detail pages are discovered automatically and do
not need registering by hand.

Pushing to `main` triggers `.github/workflows/deploy.yml`, which typechecks,
builds, and publishes `dist/client` to GitHub Pages. `dist/server` is produced
only to run the prerender and is never deployed.

Because hosting is static, there is **no backend**: no server routes, no form
handlers, no runtime environment variables. Anything requiring a server has to be
a third-party service called from the client.

Two GitHub Pages requirements are handled in `public/`: `.nojekyll` (otherwise
Jekyll strips `_`-prefixed paths) and `404.html`. Every real route is prerendered,
so a 404 is always genuine -- `404.html` is a plain static page and deliberately
does *not* try to re-enter the router.
