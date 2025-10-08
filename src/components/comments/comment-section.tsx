"use client";

import { useState, useEffect, useOptimistic, useTransition } from "react";
import { getSnippetComments } from "@/app/actions/snippets";
import { getDocumentComments } from "@/app/actions/documents";
import type { Comment as CommentType, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm } from "./comment-form";
import { useCurrentUser } from "@/hooks/use-current-user";

type PopulatedComment = (CommentType & { author: User });

interface CommentSectionProps {
  snippetId?: string;
  documentId?: string;
  isSheet?: boolean;
}

export function CommentSection({ snippetId, documentId, isSheet = false }: CommentSectionProps) {
  const user = useCurrentUser();
  const [comments, setComments] = useState<PopulatedComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      setIsLoading(true);
      try {
        let fetchedComments;
        if (snippetId) {
          fetchedComments = await getSnippetComments(snippetId) as PopulatedComment[];
        } else if (documentId) {
          fetchedComments = await getDocumentComments(documentId) as PopulatedComment[];
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

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: any) => [
      ...state,
      {
        ...newComment,
        id: "optimistic",
        author: user,
        createdAt: new Date(),
      },
    ]
  );
  
  const handleCommentAdded = (comment: any) => {
     addOptimisticComment(comment);
  };

  const containerClasses = isSheet ? "" : "pt-6 border-t";

  return (
    <div className="space-y-6">
      {!isSheet && <h3 className="text-lg font-semibold font-headline">Comments</h3>}
      <div className="space-y-4">
        {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : optimisticComments.length > 0 ? (
          optimisticComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.image ?? undefined} alt={comment.author?.name ?? ''} data-ai-hint="person face" />
                <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <Link href={`/profile/${comment.author?.username}`} className="font-semibold text-sm hover:underline">
                    {comment.author?.name}
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
      <div className={containerClasses}>
        <CommentForm 
            snippetId={snippetId} 
            documentId={documentId}
            onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
}
