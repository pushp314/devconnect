import { mockDocs, mockUsers } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';

// This is a simplified markdown renderer.
// In a real app, you'd use a more robust library like 'marked' or 'react-markdown'.
const renderMarkdown = (markdown: string) => {
  const parts = markdown.split(/(```[\s\S]*?```)/);
  return parts.map((part, index) => {
    const codeMatch = part.match(/```(\w+)?\n([\s\S]+)```/);
    if (codeMatch) {
      const language = codeMatch[1] || 'bash';
      const code = codeMatch[2];
      return <CodeBlock key={index} language={language} code={code} />;
    }
    return part.split('\n').map((line, lineIndex) => {
      if (line.startsWith('# ')) {
        return <h1 key={`${index}-${lineIndex}`} className="text-3xl font-bold font-headline mt-8 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={`${index}-${lineIndex}`} className="text-2xl font-bold font-headline mt-6 mb-3">{line.substring(3)}</h2>;
      }
      if (line.trim() === '') {
        return <br key={`${index}-${lineIndex}`} />;
      }
      return <p key={`${index}-${lineIndex}`} className="my-4 leading-relaxed">{line}</p>;
    });
  });
};


export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = mockDocs.find((d) => d.slug === params.slug);

  if (!doc) {
    notFound();
  }

  return (
    <article className="container max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl mb-4">
          {doc.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={doc.author.avatarUrl} alt={doc.author.name} data-ai-hint="person face" />
              <AvatarFallback>{doc.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{doc.author.name}</span>
          </div>
          <span>·</span>
          <time dateTime={doc.createdAt}>{doc.createdAt}</time>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {renderMarkdown(doc.content)}
      </div>

      <footer className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center">
            <div className="flex gap-1 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{doc.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{doc.commentsCount}</span>
                </Button>
            </div>
            <Button variant="outline" size="icon">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Save</span>
            </Button>
        </div>
      </footer>
    </article>
  );
}
