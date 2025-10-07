"use client";

import { useState } from "react";
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
}

export function CommentForm({ snippetId, documentId }: CommentFormProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setIsSubmitting(true);
    try {
      if (snippetId) {
        await addSnippetComment({ content, snippetId });
      } else if (documentId) {
        await addDocumentComment({ content, documentId });
      }
      setContent("");
      toast({ title: "Comment posted!" });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Failed to post comment." });
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting || !content.trim()} className="self-end">
        {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
        Post Comment
      </Button>
    </form>
  );
}
