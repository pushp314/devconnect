import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Snippet } from "@/lib/types";
import { Bookmark, Heart, MessageCircle, Wand2 } from "lucide-react";
import { CodeBlock } from "./code-block";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={snippet.author.avatarUrl} alt={snippet.author.name} data-ai-hint="person face" />
          <AvatarFallback>{snippet.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{snippet.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            <Link href={`/profile/${snippet.author.username}`} className="font-semibold hover:underline">
              {snippet.author.name}
            </Link>
            <span className="mx-2">·</span>
            <time dateTime={snippet.createdAt}>{snippet.createdAt}</time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{snippet.description}</p>
        <CodeBlock code={snippet.code} language={snippet.language} />
        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-1 text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{snippet.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{snippet.commentsCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <span>Explain</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Bookmark className="h-5 w-5" />
          <span className="sr-only">Save</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
