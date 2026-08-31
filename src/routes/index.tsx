import { createFileRoute, Link } from '@tanstack/react-router'
import { allEducations, allJobs, allNews } from 'content-collections'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { SocialLinks } from '@/components/social-links'
import { site } from '@/lib/site'
import { byRecencyDesc, formatRange, formatYearRange } from '@/lib/dates'

export const Route = createFileRoute('/')({
  component: Home,
})

const pageLinks = [
  { to: '/publications', label: 'Publications' },
  { to: '/projects', label: 'Projects' },
  { to: '/cv', label: 'Full CV' },
] as const

function Home() {
  const news = [...allNews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const educations = [...allEducations].sort(byRecencyDesc)
  const jobs = [...allJobs].sort(byRecencyDesc)

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <section className="flex flex-col md:flex-row items-start gap-10 mb-16">
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
            <p className="text-muted-foreground mb-4">{site.secondaryRole}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-4">
              {pageLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-1 text-foreground font-medium hover:underline"
                >
                  {link.label} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
            <SocialLinks className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" />
          </div>
        </section>

        {/* About Me */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-6">About Me</h2>

          <div className="max-w-3xl space-y-4 leading-relaxed mb-10">
            <p>
              I am currently a PhD student in the{' '}
              <span className="font-medium">Bioengineering Group</span> of the
              Department of Electronics, Information and Bioengineering (DEIB)
              at Politecnico di Milano, where I work on XR/AR solutions and
              computer vision for neurosurgical procedures. Alongside my
              doctoral research I work as a Surgical Navigation Software
              Engineer for <span className="font-medium">XRlabs</span>, based at
              the London Institute of Healthcare Engineering. Prior to this, I
              was a project intern at <span className="font-medium">IHU</span>,
              the Institute of Image-Guided Surgery in Strasbourg.
            </p>
            <p>
              I earned my BSc in Biomedical Engineering from Politecnico di
              Milano in 2020, followed by an MSc in Biomedical Engineering from
              the same institution in 2023. During my master&apos;s I was
              awarded a competitive HealthTech scholarship to study Computer
              Aided Surgery and Robotics at the University of Strasbourg.
            </p>
          </div>

          {/* Interests */}
          <h3 className="font-serif text-xl font-semibold mb-4">Interests</h3>
          <ul className="max-w-3xl space-y-2 mb-10 list-disc pl-5">
            {site.interests.map((interest) => (
              <li key={interest.area} className="leading-relaxed">
                <span className="font-medium">{interest.area}</span>
                <span className="text-muted-foreground">
                  {' '}
                  — {interest.topics}
                </span>
              </li>
            ))}
          </ul>

          {/* Education */}
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
        </section>

        {/* Working Experience */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-semibold mb-6">
            Working Experience
          </h2>
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
        </section>

        {/* News */}
        <section>
          <h2 className="font-serif text-2xl font-semibold mb-6">News</h2>
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
        </section>
      </div>
    </div>
  )
}
