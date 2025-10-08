"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { upvoteBug } from "@/app/actions/bugs";
import { useRouter } from "next/navigation";

interface UpvoteButtonProps {
    bugId: string;
    isUpvoted: boolean;
}

export function UpvoteButton({ bugId, isUpvoted: initialIsUpvoted }: UpvoteButtonProps) {
    const user = useCurrentUser();
    const router = useRouter();
    const { toast } = useToast();
    
    const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
    const [isPending, startTransition] = useTransition();

    const handleUpvote = () => {
        if (!user) {
            router.push('/auth/signin');
            return;
        }

        startTransition(async () => {
            try {
                await upvoteBug(bugId);
                setIsUpvoted(!isUpvoted);
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Something went wrong.' });
            }
        });
    }
    
    return (
        <Button 
            variant={isUpvoted ? 'default' : 'outline'}
            onClick={handleUpvote}
            disabled={isPending}
            >
            <ThumbsUp className={cn("mr-2 h-4 w-4", isUpvoted && "fill-current")} />
            <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
        </Button>
    );
}
