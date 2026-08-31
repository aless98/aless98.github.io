import { createFileRoute } from '@tanstack/react-router'
import { allPublications } from 'content-collections'
import { marked } from 'marked'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Github } from 'lucide-react'

export const Route = createFileRoute('/publications/$slug')({
  component: PublicationPage,
})

function PublicationPage() {
  const { slug } = Route.useParams()
  const pub = allPublications.find((p) => p._meta.path === slug)

  if (!pub) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Publication not found</h1>
          <a href="/#publications" className="text-foreground hover:underline">
            Back to publications
          </a>
        </div>
      </div>
    )
  }

  const html = marked(pub.content)

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a
          href="/#publications"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} />
          Back to publications
        </a>

        <article>
          <header className="mb-8">
            <h1 className="font-serif text-3xl font-semibold mb-3">
              {pub.title}
            </h1>
            <p className="text-muted-foreground mb-1">{pub.authors}</p>
            <p className="text-sm text-muted-foreground mb-4">{pub.venue}</p>
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
                  className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                >
                  <FileText size={14} /> PDF
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
            </div>
          </header>

          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </div>
  )
}
