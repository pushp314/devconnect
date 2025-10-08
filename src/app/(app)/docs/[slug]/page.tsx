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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ClientTime } from '@/components/client-time';

const MarkdownComponents = {
  h1: (props: any) => <h1 className="text-4xl font-extrabold font-headline mt-10 mb-4 pb-2 border-b" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold font-headline mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold font-headline mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="my-4 leading-relaxed text-lg" {...props} />,
  ul: (props: any) => <ul className="list-disc ml-6 my-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal ml-6 my-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-lg" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className="my-6">
        <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
      </div>
    ) : (
      <code className="bg-muted text-foreground font-code px-1.5 py-1 rounded-md" {...props}>
        {children}
      </code>
    )
  },
  table: (props: any) => <table className="w-full my-6 border-collapse border border-border" {...props} />,
  thead: (props: any) => <thead className="bg-muted" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-border" {...props} />,
  th: (props: any) => <th className="p-3 text-left font-semibold border-r border-border" {...props} />,
  td: (props: any) => <td className="p-3 border-r border-border" {...props} />,
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
        <h1 className="text-5xl font-extrabold font-headline tracking-tight lg:text-6xl mb-4 text-center">
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
          <ClientTime date={doc.createdAt} format={{ year: 'numeric', month: 'long', day: 'numeric' }} />
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
        <ReactMarkdown
          components={MarkdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {doc.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-12 pt-8 border-t">
        <DocInteraction doc={doc as any} />
      </footer>
    </article>
  );
}
