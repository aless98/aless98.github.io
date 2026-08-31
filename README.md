# Alessandro Albanesi — Personal Website

The personal academic website of Alessandro Albanesi, PhD student in the Bioengineering Group (DEIB) at Politecnico di Milano (XR/AR and computer vision for neurosurgery) and Surgical Navigation Software Engineer consulting for XRlabs. It features a bio and news feed, a CV, a filterable research projects gallery, a publications list, and a contact form.

Identity and profile links live in `src/lib/site.ts`. The `content/jobs` and `content/education` markdown files are still template placeholders and need replacing.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) with React 19 and file-based routing (TanStack Router)
- [Content Collections](https://www.content-collections.dev/) for type-safe markdown content
- Tailwind CSS 4 with Radix UI primitives
- Prerendered to static HTML and deployed to GitHub Pages

## Project Structure

- `content/` — markdown content: `jobs`, `education`, `publications`, `projects`, `news`
- `src/routes/` — pages: home (`index.tsx`), CV (`cv.tsx`), publications, projects, contact
- `src/components/` — shared UI, including the site navigation (`nav.tsx`)

See `AGENTS.md` for a more detailed architecture overview.

## Running Locally

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Editing Content

Add or edit markdown files in `content/jobs`, `content/education`, `content/publications`, `content/projects`, or `content/news`. Each collection's required frontmatter fields are defined in `content-collections.ts`.
