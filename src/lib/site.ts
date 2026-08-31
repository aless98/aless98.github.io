/**
 * Single source of truth for identity and external profile links.
 * Edit here; nav, footer, home page, and document metadata all read from it.
 */
export const site = {
  name: 'Alessandro Albanesi',
  /** Canonical origin. Used for canonical URLs, Open Graph and JSON-LD. */
  url: 'https://aless98.github.io',
  cvPath: '/alessandro-albanesi-cv.pdf',
  shortName: 'Alessandro Albanesi',
  role: 'PhD Student — XR/AR and Computer Vision for Neurosurgery',
  affiliation:
    'Bioengineering Group, Department of Electronics, Information and Bioengineering (DEIB), Politecnico di Milano',
  /** Condensed form for tight spots like the footer. */
  affiliationShort: 'DEIB, Politecnico di Milano',
  secondaryRole:
    'Surgical Navigation Software Engineer (consultant) at XRlabs',
  email: 'alessandroalbanesi1998@gmail.com',
  /** Research interests, grouped as area -> specific topics. */
  interests: [
    {
      area: 'Computer vision',
      topics: '3D registration, pose estimation, medical image analysis',
    },
    {
      area: 'Extended reality',
      topics: 'mixed-reality surgical guidance, head-mounted displays',
    },
    {
      area: 'Surgical navigation',
      topics: 'image-guided intervention, hologram-to-patient registration',
    },
    {
      area: 'Deep learning',
      topics: 'automatic segmentation, anatomical target identification',
    },
    { area: 'Sport', topics: 'Tennis' },
    { area: 'Outside work', topics: 'Cinema, Music' },
  ],
  links: {
    github: 'https://github.com/aless98',
    linkedin: 'https://www.linkedin.com/in/alessandro-albanesi-48ba871b8/',
    scholar:
      'https://scholar.google.com/citations?user=oIFhQ78AAAAJ&hl=en',
    orcid: 'https://orcid.org/0009-0007-3663-1882',
  },
} as const

/**
 * The single-page sections, in page order. Each `id` is both the DOM id of the
 * section and its URL hash, and the nav is generated from this list -- so
 * adding a section here wires up the anchor, the nav link, and scroll-spy.
 */
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'news', label: 'News' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'cv', label: 'CV' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']
