import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  allEducations,
  allJobs,
  allNews,
  allProjects,
  allPublications,
} from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  ChevronRight,
  Download,
  FileText,
  Github,
  GraduationCap,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  Orbit,
} from 'lucide-react'
import { SocialLinks } from '@/components/social-links'
import { site } from '@/lib/site'
import { byRecencyDesc, formatRange, formatYearRange } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { HeroBackdrop } from '@/components/hero-backdrop'
import { Reveal } from '@/components/reveal'

export const Route = createFileRoute('/')({
  component: Home,
})

const contactChannels = [
  {
    Icon: Mail,
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'alessandro-albanesi',
    href: site.links.linkedin,
  },
  { Icon: Github, label: 'GitHub', value: 'aless98', href: site.links.github },
  {
    Icon: GraduationCap,
    label: 'Google Scholar',
    value: 'Publications and citations',
    href: site.links.scholar,
  },
  {
    Icon: Orbit,
    label: 'ORCID',
    value: '0009-0007-3663-1882',
    href: site.links.orcid,
  },
] as const

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-semibold tracking-tight mb-6">
      {children}
    </h2>
  )
}

function Home() {
  const news = [...allNews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const educations = [...allEducations].sort(byRecencyDesc)
  const jobs = [...allJobs].sort(byRecencyDesc)
  const publications = [...allPublications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const categories = useMemo(
    () => ['All', ...new Set(allProjects.map((p) => p.category))],
    [],
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const filteredProjects =
    activeCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory)

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* ---------------- Hero ---------------- */}
      {/* `overflow-x-clip` contains the full-bleed child below: 100vw includes
          the scrollbar width, so without this the page gains a few pixels of
          horizontal scroll. `clip` rather than `hidden` so it cannot create a
          scroll container and interfere with the sticky header. */}
      <div className="relative overflow-x-clip">
        {/* Full-bleed: breaks out of the centred container on both sides. */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10">
          <HeroBackdrop />
        </div>
        <section className="relative flex flex-col md:flex-row items-start gap-10 pt-20 pb-28 md:min-h-[32rem] md:items-center">
        <img
          src="/headshot-on-white.jpg"
          alt={`Portrait of ${site.name}`}
          className="w-40 h-40 rounded-2xl object-cover shadow-sm shrink-0"
        />
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight mb-1">
            {site.name}
          </h1>
          <p className="text-muted-foreground mb-1">{site.role}</p>
          <p className="text-muted-foreground mb-1">{site.affiliation}</p>
          <p className="text-muted-foreground mb-5">{site.secondaryRole}</p>
          <SocialLinks className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" />
          <a
            href={site.cvPath}
            download
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} />
            Download CV (PDF)
          </a>
          </div>
        </section>
      </div>

      {/* ---------------- About ---------------- */}
      <Reveal as="section" id="about" className="pb-20">
        <SectionHeading>About</SectionHeading>

        <div className="max-w-3xl space-y-4 leading-relaxed mb-10">
          <p>
            I am currently a PhD student in the{' '}
            <span className="font-medium">Bioengineering Group</span> of the
            Department of Electronics, Information and Bioengineering (DEIB) at
            Politecnico di Milano, where I work on XR/AR solutions and computer
            vision for neurosurgical procedures. Alongside my doctoral research
            I work as a Surgical Navigation Software Engineer for{' '}
            <span className="font-medium">XRlabs</span>, based at the London
            Institute of Healthcare Engineering. Prior to this, I was a project
            intern at <span className="font-medium">IHU</span>, the Institute of
            Image-Guided Surgery in Strasbourg.
          </p>
          <p>
            I earned my BSc in Biomedical Engineering from Politecnico di Milano
            in 2020, followed by an MSc in Biomedical Engineering from the same
            institution in 2023. During my master&apos;s I was awarded a
            competitive HealthTech scholarship to study Computer Aided Surgery
            and Robotics at the University of Strasbourg.
          </p>
        </div>

        <h3 className="font-serif text-xl font-semibold mb-4">Interests</h3>
        <ul className="max-w-3xl space-y-2 mb-10 list-disc pl-5">
          {site.interests.map((interest) => (
            <li key={interest.area} className="leading-relaxed">
              <span className="font-medium">{interest.area}</span>
              <span className="text-muted-foreground"> — {interest.topics}</span>
            </li>
          ))}
        </ul>

        <h3 className="font-serif text-xl font-semibold mb-4">Education</h3>
        <ul className="max-w-3xl space-y-3 list-disc pl-5">
          {educations.map((education) => (
            <li key={education._meta.path}>
              <span className="font-medium">
                {education.degree}
                {education.distinction ? ` (${education.distinction})` : ''}
              </span>
              <span className="text-muted-foreground">
                , {formatYearRange(education.startDate, education.endDate)}
              </span>
              <br />
              <span className="text-muted-foreground">
                {education.institution}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ---------------- News ---------------- */}
      <Reveal as="section" id="news" className="pb-20">
        <SectionHeading>News</SectionHeading>
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item._meta.path}>
              <CardContent className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 py-4">
                <time className="text-sm text-muted-foreground shrink-0 sm:w-32">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </time>
                <p className="leading-relaxed">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Projects ---------------- */}
      <Reveal as="section" id="projects" className="pb-20">
        <SectionHeading>Projects</SectionHeading>
        <p className="text-muted-foreground mb-6">
          Extended reality, computer vision, and navigation systems for
          image-guided surgery.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                activeCategory === category
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project._meta.path}
              className="flex flex-col overflow-hidden"
            >
              {(project.video || project.image) && (
                <div className="-mt-6 aspect-video overflow-hidden border-b border-border bg-muted">
                  {project.video ? (
                    <video
                      src={project.video}
                      poster={project.image || undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      // React does not reliably apply `muted` across hydration,
                      // and browsers refuse to autoplay a video that is not
                      // provably muted. Set it on the element directly.
                      ref={(el) => {
                        if (el) el.muted = true
                      }}
                      aria-label={`${project.title} demonstration`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={project.image}
                      alt={`${project.title} project illustration`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">
                  {project.category}
                </Badge>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {project.github && (
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Publications ---------------- */}
      <Reveal as="section" id="publications" className="pb-20">
        <SectionHeading>Publications</SectionHeading>
        <p className="text-muted-foreground mb-6">
          Peer-reviewed papers on mixed reality, computer vision, and robotics
          for image-guided surgery. Click an entry to expand it.
        </p>

        <div className="space-y-3">
          {publications.map((pub) => (
            /* Native <details>: expands without JS and before hydration. */
            <details
              key={pub._meta.path}
              className="group border border-border rounded-xl bg-card"
            >
              <summary className="flex items-start gap-3 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  size={18}
                  className="mt-1 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                />
                <span className="min-w-0">
                  <span className="block font-medium leading-snug">
                    {pub.title}
                  </span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    {pub.venue}
                  </span>
                </span>
              </summary>

              <div className="px-5 pb-5 sm:pl-14 space-y-4">
                <p className="text-sm text-muted-foreground">{pub.authors}</p>
                <p className="leading-relaxed">{pub.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {pub.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {pub.pdfUrl && (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                    >
                      <FileText size={14} /> Paper
                    </a>
                  )}
                  {pub.codeUrl && (
                    <a
                      href={pub.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                  <Link
                    to="/publications/$slug"
                    params={{ slug: pub._meta.path }}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Link2 size={14} /> Permalink
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Reveal>

      {/* ---------------- CV ---------------- */}
      <Reveal as="section" id="cv" className="pb-20">
        <SectionHeading>CV</SectionHeading>
        <a
          href={site.cvPath}
          download
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-lg border border-border text-sm font-medium hover:border-foreground/40 transition-colors"
        >
          <Download size={16} />
          Download full CV (PDF)
        </a>
        <h3 className="font-serif text-xl font-semibold mb-4">
          Working Experience
        </h3>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._meta.path}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <p className="font-medium">
                    {job.jobTitle} ·{' '}
                    <span className="font-normal">{job.company}</span>
                  </p>
                  <p className="text-sm text-muted-foreground shrink-0">
                    {formatRange(job.startDate, job.endDate)}
                  </p>
                </div>
                {job.location && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {job.location}
                  </p>
                )}
                <p className="leading-relaxed mb-3">{job.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Contact ---------------- */}
      <Reveal as="section" id="contact" className="pb-24">
        <SectionHeading>Contact</SectionHeading>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          For collaborations, research enquiries, or anything else, email is the
          most reliable way to reach me.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-3xl">
          {contactChannels.map(({ Icon, label, value, href }) => {
            const isMail = href.startsWith('mailto:')
            return (
              <a
                key={label}
                href={href}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
                className="block group"
              >
                <Card className="h-full transition-colors group-hover:border-foreground/30">
                  <CardContent className="py-4 flex items-center gap-4">
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span className="block font-medium truncate group-hover:underline">
                        {value}
                      </span>
                    </span>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>

        <h3 className="font-serif text-xl font-semibold mb-4">Affiliation</h3>
        <div className="space-y-3 text-muted-foreground max-w-2xl">
          <p className="flex items-start gap-3">
            <Building2 size={18} className="mt-0.5 shrink-0" />
            <span>{site.affiliation}</span>
          </p>
          <p className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            <span>Milan, Italy</span>
          </p>
        </div>
      </Reveal>
    </div>
  )
}
