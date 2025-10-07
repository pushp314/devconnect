import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Snippet } from "@/lib/types";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={snippet.author.avatarUrl} alt={snippet.author.name} data-ai-hint="person face" />
          <AvatarFallback>{snippet.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <Link href={`/profile/${snippet.author.username}`} className="font-semibold hover:underline">
            {snippet.author.name}
          </Link>
          <p className="text-sm text-muted-foreground">
            <time dateTime={snippet.createdAt}>{snippet.createdAt}</time>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{snippet.description}</p>
        <div className="rounded-md border bg-background/50 p-4 font-code text-sm overflow-x-auto">
          <pre>
            <code>{snippet.code}</code>
          </pre>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{snippet.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{snippet.commentsCount}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Bookmark className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
