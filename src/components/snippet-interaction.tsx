"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Bookmark, Heart, MessageCircle, Wand2, GitFork, Loader2 } from "lucide-react";
import type { Snippet } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { toggleSnippetLike, toggleSnippetSave, forkSnippet } from "@/app/actions/snippets";
import { AIExplanationModal } from "@/components/ai-explanation-modal";
import { CommentsSheet } from "@/components/comments/comments-sheet";
import { useRouter } from "next/navigation";

type InteractionProps = {
  snippet: Snippet & {
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isSaved?: boolean;
  };
};

export function SnippetInteraction({ snippet }: InteractionProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(snippet.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(snippet.likesCount);
  const [isSaved, setIsSaved] = useState(snippet.isSaved ?? false);
  const [isExplainModalOpen, setExplainModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isForking, startForkingTransition] = useTransition();

  const handleLike = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication required" });
      return;
    }
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(likesCount + (!isLiked ? 1 : -1));
    await toggleSnippetLike(snippet.id);
  };

  const handleSave = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication required" });
      return;
    }
    // Optimistic update
    setIsSaved(!isSaved);
    await toggleSnippetSave(snippet.id);
     toast({
        title: isSaved ? "Snippet unsaved" : "Snippet saved!",
        description: isSaved ? "Removed from your saved items." : "You can find it in your profile's saved tab.",
      });
  };

  const handleFork = () => {
    if (!user) {
        toast({ variant: "destructive", title: "You must be logged in to fork." });
        router.push('/auth/signin');
        return;
    }
    startForkingTransition(async () => {
        try {
            const forkedSnippet = await forkSnippet(snippet.id);
            toast({
                title: "Snippet Forked!",
                description: `A copy has been added to your profile.`,
            });
            router.push(`/snippets/${forkedSnippet.id}/edit`);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Forking failed",
                description: (error as Error).message
            });
        }
    });
  }

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-1 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center gap-2", { "text-primary": isLiked })}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", { "fill-current": isLiked })} />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowComments(true)}>
            <MessageCircle className="h-4 w-4" />
            <span>{snippet.commentsCount}</span>
          </Button>
           {snippet.allowForks && user?.id !== snippet.authorId && (
            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleFork} disabled={isForking}>
              {isForking ? <Loader2 className="animate-spin" /> : <GitFork className="h-4 w-4" />}
              <span>Fork</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setExplainModalOpen(true)}>
            <Wand2 className="h-4 w-4 text-primary" />
            <span>Explain</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Bookmark
            className={cn("h-5 w-5", { "fill-current text-primary": isSaved })}
          />
          <span className="sr-only">Save</span>
        </Button>
      </div>

      <CommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        snippetId={snippet.id}
      />

      <AIExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        code={snippet.code}
      />
    </>
  );
}
