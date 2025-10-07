import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Doc } from "@/lib/types";

interface DocCardProps {
  doc: Doc;
}

export function DocCard({ doc }: DocCardProps) {
  const excerpt = doc.content.substring(0, 150) + '...';

  return (
    <Link href={`/docs/${doc.slug}`}>
      <Card className="transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-xl">{doc.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={doc.author.avatarUrl} alt={doc.author.name} data-ai-hint="person face" />
              <AvatarFallback>{doc.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{doc.author.name}</span>
            <span className="mx-1">·</span>
            <time dateTime={doc.createdAt}>{doc.createdAt}</time>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {doc.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
