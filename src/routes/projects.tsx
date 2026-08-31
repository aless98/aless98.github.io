import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { allProjects } from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

function Projects() {
  const categories = useMemo(
    () => ['All', ...new Set(allProjects.map((p) => p.category))],
    [],
  )
  const [active, setActive] = useState('All')

  const filtered =
    active === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === active)

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-semibold mb-2">Projects</h1>
        <p className="text-muted-foreground mb-6">
          Extended reality, computer vision, and navigation systems for image-guided surgery.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                active === category
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <Card key={project._meta.path} className="flex flex-col overflow-hidden">
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
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
