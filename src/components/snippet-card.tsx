import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./code-block";
import type { Snippet, User, Like, Comment } from "@prisma/client";
import { SnippetInteraction } from "./snippet-interaction";
import { auth } from "@/lib/auth";
import { SnippetActionsMenu } from "./snippet-actions-menu";

type PopulatedSnippet = Snippet & {
  author: User;
  likes: Like[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
};

interface SnippetCardProps {
  snippet: PopulatedSnippet;
}

export async function SnippetCard({ snippet }: SnippetCardProps) {
  const session = await auth();
  const isAuthor = session?.user?.id === snippet.authorId;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={snippet.author.image ?? undefined} alt={snippet.author.name ?? ''} data-ai-hint="person face" />
          <AvatarFallback>{snippet.author.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{snippet.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            <Link href={`/profile/${snippet.author.username}`} className="font-semibold hover:underline">
              {snippet.author.name}
            </Link>
            <span className="mx-2">·</span>
            <time dateTime={snippet.createdAt.toISOString()}>{snippet.createdAt.toLocaleDateString()}</time>
          </div>
        </div>
         {isAuthor && <SnippetActionsMenu snippetId={snippet.id} />}
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <p className="text-sm">{snippet.description}</p>
        <CodeBlock code={snippet.code} language={snippet.language.toLowerCase()} />
        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <SnippetInteraction snippet={snippet} />
      </CardFooter>
    </Card>
  );
}
