import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const jobs = defineCollection({
  name: 'jobs',
  directory: 'content/jobs',
  include: '**/*.md',
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

const education = defineCollection({
  name: 'education',
  directory: 'content/education',
  include: '**/*.md',
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    /** Grade or honours, e.g. "110/110" — shown in parentheses after the degree. */
    distinction: z.string().optional(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
})

const publications = defineCollection({
  name: 'publications',
  directory: 'content/publications',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    authors: z.string(),
    venue: z.string(),
    pdfUrl: z.string().optional(),
    codeUrl: z.string().optional(),
    content: z.string(),
  }),
})

const news = defineCollection({
  name: 'news',
  directory: 'content/news',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    content: z.string(),
  }),
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    liveUrl: z.string().optional(),
    image: z.string().optional(),
    // When set, the card plays this looping muted video instead of `image`.
    // `image` is then used as its poster frame.
    video: z.string().optional(),
    content: z.string(),
  }),
})

export default defineConfig({
  collections: [jobs, education, publications, news, projects],
})
