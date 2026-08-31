import { createFileRoute, Link } from '@tanstack/react-router'
import { allPublications } from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Github } from 'lucide-react'

export const Route = createFileRoute('/publications/')({
  component: PublicationsIndex,
})

function PublicationsIndex() {
  const pubs = [...allPublications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-semibold mb-2">
          Publications
        </h1>
        <p className="text-muted-foreground mb-8">
          Peer-reviewed papers on mixed reality, computer vision, and robotics for image-guided surgery.
        </p>

        <div className="space-y-6">
          {pubs.map((pub) => (
            <Card key={pub._meta.path}>
              <CardHeader>
                <Link
                  to="/publications/$slug"
                  params={{ slug: pub._meta.path }}
                  className="hover:underline"
                >
                  <CardTitle className="text-xl">{pub.title}</CardTitle>
                </Link>
                <p className="text-sm text-muted-foreground">{pub.authors}</p>
                <p className="text-sm text-muted-foreground">{pub.venue}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{pub.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pub.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  {pub.pdfUrl && (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText size={14} /> PDF
                    </a>
                  )}
                  {pub.codeUrl && (
                    <a
                      href={pub.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={14} /> Code
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
