import { marked } from 'marked'

import { createFileRoute } from '@tanstack/react-router'
import { allJobs, allEducations } from 'content-collections'
import { byRecencyDesc, formatRange, formatYearRange } from '@/lib/dates'
import { site } from '@/lib/site'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export const Route = createFileRoute('/cv')({
  component: App,
})

function App() {
  const jobs = [...allJobs].sort(byRecencyDesc)
  const educations = [...allEducations].sort(byRecencyDesc)

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl font-semibold">
            Curriculum Vitae
          </h1>
          <p className="text-lg text-muted-foreground">
            Work Experience & Education
          </p>
          <Separator className="mt-8" />
        </div>

        {/* Research Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Research Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <p className="flex-1 leading-relaxed">
                My research brings extended reality and computer vision into
                the operating room, so that a plan built on pre-operative
                imaging can be seen directly on the patient. I work on
                markerless hologram-to-patient registration, on-headset
                optical tool tracking, and deep-learning methods for
                identifying anatomical targets — with validation carried
                through phantoms and into multicentric clinical study.
              </p>
              <img
                src="/headshot-on-white.jpg"
                alt={`Professional headshot of ${site.name}`}
                className="w-44 h-52 rounded-2xl object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">
            Work Experience
          </h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job._meta.path}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {job.jobTitle}
                      </CardTitle>
                      <p className="font-medium">
                        {job.company}
                        {job.location ? ` - ${job.location}` : ''}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {formatRange(job.startDate, job.endDate)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 leading-relaxed">
                    {job.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <HoverCard key={tag}>
                        <HoverCardTrigger>
                          <Badge variant="outline" className="cursor-pointer">
                            {tag}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <p className="text-sm">
                            Experience with {tag} in professional development
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                  {job.content && (
                    <div
                      className="mt-6 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: marked(job.content),
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">
            Education
          </h2>
          <div className="space-y-6">
            {educations.map((education) => (
              <Card key={education._meta.path}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {education.degree}
                        {education.distinction
                          ? ` (${education.distinction})`
                          : ''}
                      </CardTitle>
                      <p className="font-medium">{education.institution}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm shrink-0">
                      {formatYearRange(education.startDate, education.endDate)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    {education.summary}
                  </p>
                  {education.content && (
                    <div
                      className="mt-6 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: marked(education.content),
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
