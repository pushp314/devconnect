"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, Heart, MessageCircle, Wand2 } from "lucide-react";
import type { Snippet } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { toggleSnippetLike, toggleSnippetSave } from "@/app/actions/snippets";

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

  const [isLiked, setIsLiked] = useState(snippet.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(snippet.likesCount);
  const [isSaved, setIsSaved] = useState(snippet.isSaved ?? false);

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
  };

  return (
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
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>{snippet.commentsCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
  );
}
