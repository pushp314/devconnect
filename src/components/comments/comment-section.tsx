"use client";

import { useState, useEffect } from "react";
import { getSnippetComments } from "@/app/actions/snippets";
import { getDocumentComments } from "@/app/actions/documents";
import type { Comment, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm } from "./comment-form";

type PopulatedComment = (Comment & { author: User }) | (any & {author: User});

interface CommentSectionProps {
  snippetId?: string;
  documentId?: string;
}

export function CommentSection({ snippetId, documentId }: CommentSectionProps) {
  const [comments, setComments] = useState<PopulatedComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true);
      try {
        let fetchedComments;
        if (snippetId) {
          fetchedComments = await getSnippetComments(snippetId);
        } else if (documentId) {
          fetchedComments = await getDocumentComments(documentId);
        }
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [snippetId, documentId]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold font-headline">Comments</h3>
      <div className="space-y-4">
        {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.image ?? undefined} alt={comment.author.name ?? ''} data-ai-hint="person face" />
                <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <Link href={`/profile/${comment.author.username}`} className="font-semibold text-sm hover:underline">
                    {comment.author.name}
                  </Link>
                  <time className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </div>
      <div className="pt-6 border-t">
        <CommentForm snippetId={snippetId} documentId={documentId} />
      </div>
    </div>
  );
}
