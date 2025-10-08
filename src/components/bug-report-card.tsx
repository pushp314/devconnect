"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type { Bug, User, BugUpvote } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { upvoteBug } from "@/app/actions/bugs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type PopulatedBug = Bug & {
  reporter: User;
  upvotes: BugUpvote[];
};

interface BugReportCardProps {
  bug: PopulatedBug;
}

export function BugReportCard({ bug }: BugReportCardProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  
  const optimisiticUpvotes = bug.upvotes.map(u => u.userId);
  const [upvotes, setUpvotes] = useState(optimisiticUpvotes);

  const isUpvoted = user ? upvotes.includes(user.id) : false;

  const handleUpvote = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in to upvote.' });
        return;
    }
    
    // Optimistic update
    if (isUpvoted) {
        setUpvotes(upvotes.filter(id => id !== user.id));
    } else {
        setUpvotes([...upvotes, user.id]);
    }

    try {
        await upvoteBug(bug.id);
    } catch (error) {
        // Revert optimistic update on error
        if (isUpvoted) {
            setUpvotes([...upvotes, user.id]);
        } else {
            setUpvotes(upvotes.filter(id => id !== user.id));
        }
        toast({ variant: 'destructive', title: 'Something went wrong.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{bug.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={bug.reporter.image ?? undefined}
              alt={bug.reporter.name ?? ""}
              data-ai-hint="person face"
            />
            <AvatarFallback>{bug.reporter.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link
            href={`/${bug.reporter.username}`}
            className="font-semibold hover:underline"
          >
            {bug.reporter.name}
          </Link>
          <span className="mx-1">·</span>
          <time dateTime={bug.createdAt.toISOString()}>
            {bug.createdAt.toLocaleDateString()}
          </time>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{bug.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={cn("flex items-center gap-2", {
                "text-primary": isUpvoted,
              })}
            >
              <ThumbsUp
                className={cn("h-4 w-4", { "fill-current": isUpvoted })}
              />
              <span>{upvotes.length} Upvotes</span>
            </Button>
          </div>
        </div>
        <Button variant="outline" disabled>View Details</Button>
      </CardFooter>
    </Card>
  );
}
