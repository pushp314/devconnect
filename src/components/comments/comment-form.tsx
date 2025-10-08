"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addSnippetComment } from "@/app/actions/snippets";
import { addDocumentComment } from "@/app/actions/documents";

interface CommentFormProps {
  snippetId?: string;
  documentId?: string;
  onCommentAdded: (comment: { content: string }) => void;
}

export function CommentForm({ snippetId, documentId, onCommentAdded }: CommentFormProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in to comment." });
      return;
    }
    if (!content.trim()) {
      toast({ variant: "destructive", title: "Comment cannot be empty." });
      return;
    }
    
    startTransition(async () => {
        onCommentAdded({ content });
        setContent("");

        try {
            if (snippetId) {
                await addSnippetComment({ content, snippetId });
            } else if (documentId) {
                await addDocumentComment({ content, documentId });
            }
            toast({ title: "Comment posted!" });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Failed to post comment." });
            // Here you might want to implement a way to remove the optimistic comment
        }
    });
  };

  if (!user) {
    return (
        <p className="text-sm text-muted-foreground">
            You must be logged in to post a comment.
        </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || !content.trim()} className="self-end">
        {isPending && <Loader2 className="mr-2 animate-spin" />}
        Post Comment
      </Button>
    </form>
  );
}
