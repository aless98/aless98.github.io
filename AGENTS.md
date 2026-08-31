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
    __root.tsx        # Root layout: Nav + page content + Footer
    index.tsx          # The whole site: one page of anchored sections
    publications/
      $slug.tsx         # Per-publication permalink page
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

## Single-page structure

The site is **one page** of anchored sections, not separate routes. `src/lib/site.ts`
exports `sections`, an ordered list of `{ id, label }`; the nav is generated from it and
each `id` is both the section's DOM id and its URL hash. Adding a section there wires up
the anchor, the nav link, and scroll-spy together -- but you must also add the matching
`<section id="...">` in `src/routes/index.tsx`.

Nav links are plain `<a href="#id">`, deliberately not router `Link`s, so jumping works
before hydration and with JavaScript disabled. Smooth scrolling and
`section[id] { scroll-margin-top }` live in `src/styles.css`; the offset must stay in
sync with the sticky header's height, which `useActiveSection` also hardcodes as
`HEADER_HEIGHT`.

Active-section highlighting uses `IntersectionObserver` (`src/lib/use-active-section.ts`),
not scroll-offset arithmetic, because section heights vary. It also special-cases the
bottom of the page: the last section is usually too short to enter the observer band and
would otherwise never highlight.

Publications expand in place using native `<details>`/`<summary>` rather than React
state, so they open without JavaScript. Each one also links to a prerendered permalink
page under `/publications/<slug>`, and those links are how the prerender crawler
discovers those pages -- removing them would silently stop the detail pages being built.

`public/{cv,projects,publications,contact}/index.html` are redirect stubs left from when
those were real routes: `meta refresh` to the matching anchor, `noindex`, plus a canonical
pointing at the real URL. `public/projects/` holds both a stub and the project media;
they coexist because the route HTML is `index.html`.

## Theme, motion and the hero canvas

`src/lib/theme.ts` exports `themeInitScript`, inlined in `<head>` by `__root.tsx`.
It must stay inline and synchronous: it resolves the theme before first paint (so
dark-mode visitors get no white flash) and adds a `js` class to `<html>`.

That `js` class is load-bearing. The scroll-reveal styles in `src/styles.css` are
written as `.js .reveal`, so **without JavaScript nothing is hidden** and the
prerendered content stays visible. Never write an ungated `.reveal { opacity: 0 }`
-- that would make the whole page invisible to anything that does not run JS,
including the crawlers the prerendering exists to serve.

`src/components/reveal.tsx` reveals once and disconnects. Sections skipped by a
fast scroll or an anchor jump reveal when they are next scrolled into view.

`src/components/hero-backdrop.tsx` draws a point cloud and a rigid marker
constellation on a canvas. It pauses via IntersectionObserver when off-screen,
draws a single static frame under `prefers-reduced-motion`, and re-reads the
theme each frame so the toggle needs no remount.

The hero's full-bleed wrapper needs `overflow-x-clip`: its child is `w-screen`,
and `100vw` includes the scrollbar width, which otherwise adds a few pixels of
horizontal page scroll. Use `clip`, not `hidden`, so it cannot become a scroll
container and break the sticky header.

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
