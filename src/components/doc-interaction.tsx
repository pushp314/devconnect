"use client";

import { useState } from "react";
import type { Document } from "@prisma/client";
import { Button } from "./ui/button";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleDocumentLike, toggleDocumentSave } from "@/app/actions/documents";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { CommentSection } from "@/components/comments/comment-section";

interface DocInteractionProps {
  doc: Document & { isLiked: boolean; isSaved: boolean; likesCount: number; commentsCount: number; };
}

export function DocInteraction({ doc }: DocInteractionProps) {
  const user = useCurrentUser();
  const { toast } = useToast();

  const [isLiked, setIsLiked] = useState(doc.isLiked);
  const [likesCount, setLikesCount] = useState(doc.likesCount);
  const [isSaved, setIsSaved] = useState(doc.isSaved);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication required" });
      return;
    }
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(likesCount + (!isLiked ? 1 : -1));
    await toggleDocumentLike(doc.id);
  };
  
  const handleSave = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication required" });
      return;
    }
    // Optimistic update
    setIsSaved(!isSaved);
    await toggleDocumentSave(doc.id);
  };

  return (
    <>
      <div className="flex justify-between items-center">
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
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            <span>{doc.commentsCount}</span>
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <Bookmark className={cn("h-5 w-5", { "fill-current text-primary": isSaved })} />
          <span className="sr-only">Save</span>
        </Button>
      </div>
      {showComments && (
        <div className="mt-6">
          <CommentSection documentId={doc.id} />
        </div>
      )}
    </>
  );
}
