import { getDocumentBySlug } from '@/app/actions/documents';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from '@/components/code-block';
import { DocInteraction } from '@/components/doc-interaction';
import type { User } from '@prisma/client';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteDocButton } from '@/components/delete-doc-button';

const renderMarkdown = (markdown: string) => {
  const parts = markdown.split(/(```[\s\S]*?```)/);
  return parts.map((part, index) => {
    const codeMatch = part.match(/```(\w+)?\n([\s\S]+)```/);
    if (codeMatch) {
      const language = codeMatch[1] || 'bash';
      const code = codeMatch[2];
      return <div className="my-6" key={index}><CodeBlock language={language} code={code} /></div>;
    }
    return part.split('\n').map((line, lineIndex) => {
      if (line.startsWith('# ')) {
        return <h1 key={`${index}-${lineIndex}`} className="text-4xl font-extrabold font-headline mt-10 mb-4 pb-2 border-b">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={`${index}-${lineIndex}`} className="text-3xl font-bold font-headline mt-8 mb-4">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={`${index}-${lineIndex}`} className="text-2xl font-bold font-headline mt-6 mb-3">{line.substring(4)}</h3>;
      }
      if (line.trim() === '') {
        return <br key={`${index}-${lineIndex}`} />;
      }
      return <p key={`${index}-${lineIndex}`} className="my-4 leading-relaxed text-lg">{line}</p>;
    });
  });
};

export default async function DocPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  const doc = await getDocumentBySlug(params.slug);

  if (!doc) {
    notFound();
  }
  
  const isAuthor = session?.user?.id === doc.authorId;
  const author = doc.author as User;

  return (
    <article className="container max-w-4xl mx-auto py-12">
      <header className="mb-10 text-center">
        <div className="flex justify-center flex-wrap gap-2 mb-4">
            {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
        </div>
        <h1 className="text-5xl font-extrabold font-headline tracking-tight lg:text-6xl mb-4">
          {doc.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground mt-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.image ?? undefined} alt={author.name ?? ''} data-ai-hint="person face" />
              <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-lg">{author.name}</span>
          </div>
          <span>·</span>
          <time dateTime={doc.createdAt.toISOString()}>{new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
      </header>

      {isAuthor && (
          <div className="flex justify-end gap-2 mb-6 border-b pb-6">
              <Button variant="outline" asChild>
                  <Link href={`/docs/${doc.slug}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Link>
              </Button>
              <DeleteDocButton documentId={doc.id} />
          </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderMarkdown(doc.content)}
      </div>

      <footer className="mt-12 pt-8 border-t">
        <DocInteraction doc={doc as any} />
      </footer>
    </article>
  );
}
