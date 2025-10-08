"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addSnippetComment } from "@/app/actions/snippets";
import { addDocumentComment } from "@/app/actions/documents";
import { addBugComment } from "@/app/actions/bugs";
import { MentionsDropdown } from "./mentions-dropdown";
import { getUsers } from "@/app/actions/users";
import type { User } from "@prisma/client";

interface CommentFormProps {
  snippetId?: string;
  documentId?: string;
  bugId?: string;
  onCommentAdded: (comment: { content: string }) => void;
}

export function CommentForm({ snippetId, documentId, bugId, onCommentAdded }: CommentFormProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // For @mentions
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
        if (mentionQuery.length > 0) {
            const fetchedUsers = await getUsers({ query: mentionQuery });
            setUsers(fetchedUsers);
        } else {
            setUsers([]);
        }
    };
    if (showMentions) {
        fetchUsers();
    }
  }, [mentionQuery, showMentions]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w+)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (username: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    
    const newText = textBeforeCursor.replace(/@(\w+)$/, `@${username} `) + textAfterCursor;
    setContent(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };


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
            } else if (bugId) {
                await addBugComment({ content, bugId });
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
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Add a comment... use '@' to mention a user."
          value={content}
          onChange={handleInputChange}
          rows={3}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !content.trim()} className="self-end">
          {isPending && <Loader2 className="mr-2 animate-spin" />}
          Post Comment
        </Button>
      </form>
       {showMentions && (
        <MentionsDropdown
          users={users}
          onSelect={handleMentionSelect}
        />
      )}
    </div>
  );
}
