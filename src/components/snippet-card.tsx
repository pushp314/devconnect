
"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./code-block";
import type { Snippet, User, Like, Comment } from "@prisma/client";
import { SnippetInteraction } from "./snippet-interaction";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SnippetActionsMenu } from "./snippet-actions-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactLivePreview } from "./preview/ReactLivePreview";
import { isCodeSafeForPreview } from "@/lib/previewSecurity";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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

const previewLanguages = ["React", "HTML", "JavaScript"];

export function SnippetCard({ snippet }: SnippetCardProps) {
  const user = useCurrentUser();
  const isAuthor = user?.id === snippet.authorId;
  
  const isPreviewable = previewLanguages.includes(snippet.language);
  const isCodeSafe = isCodeSafeForPreview(snippet.code);
  const canShowPreview = isPreviewable && isCodeSafe;

  const renderContent = () => {
    if (canShowPreview && snippet.language === 'React') {
      return (
        <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="flex-grow my-2 relative rounded-lg border overflow-hidden bg-muted/20">
             <ReactLivePreview code={snippet.code} />
          </TabsContent>
          <TabsContent value="code" className="flex-grow my-2 relative rounded-lg border overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto">
              <CodeBlock code={snippet.code} language={snippet.language.toLowerCase()} />
            </div>
          </TabsContent>
        </Tabs>
      );
    }

    // Fallback for non-previewable or unsafe languages
    return (
        <div className="flex-grow my-2 flex flex-col gap-2">
            {!isCodeSafe && isPreviewable && (
                 <Alert variant="destructive" className="text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Preview Disabled</AlertTitle>
                    <AlertDescription>
                        This snippet contains code that is not allowed in live previews.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex-grow relative rounded-lg border overflow-hidden">
                <div className="absolute inset-0 overflow-y-auto">
                    <CodeBlock code={snippet.code} language={snippet.language.toLowerCase()} />
                </div>
            </div>
        </div>
    );
  };

  return (
    <Card id={snippet.id} className="h-full max-h-[600px] flex flex-col transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader className="flex-shrink-0 flex flex-row items-start gap-4 space-y-0">
        <Link href={`/${snippet.author.username}`}>
            <Avatar>
            <AvatarImage src={snippet.author.image ?? undefined} alt={snippet.author.name ?? ''} data-ai-hint="person face" />
            <AvatarFallback>{snippet.author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl mb-1">{snippet.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            <Link href={`/${snippet.author.username}`} className="font-semibold hover:underline">
              {snippet.author.name}
            </Link>
            <span className="mx-2 hidden sm:inline">·</span>
            <time dateTime={snippet.createdAt.toISOString()} className="hidden sm:inline">{snippet.createdAt.toLocaleDateString()}</time>
          </div>
        </div>
         {isAuthor && <SnippetActionsMenu snippetId={snippet.id} />}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
          <p className="text-sm flex-shrink-0 mb-4">{snippet.description}</p>
          {renderContent()}
      </CardContent>
      <CardFooter className="flex-shrink-0 flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2 w-full">
          {snippet.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <SnippetInteraction snippet={snippet} />
      </CardFooter>
    </Card>
  );
}
