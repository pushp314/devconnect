"use client";

import { useState, useTransition } from "react";
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
import { useRouter } from "next/navigation";
import { ClientTime } from "./client-time";

type PopulatedBug = Bug & {
  reporter: User;
  _count: {
    upvotes: number;
    comments: number;
  };
};

interface BugReportCardProps {
  bug: PopulatedBug;
}

export function BugReportCard({ bug }: BugReportCardProps) {
  const user = useCurrentUser();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isPending, startTransition] = useTransition();

  const handleUpvote = () => {
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in to upvote." });
      return;
    }
    
    startTransition(async () => {
      try {
        await upvoteBug(bug.id);
      } catch (error) {
        toast({ variant: "destructive", title: "Something went wrong." });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          <Link href={`/bugs/${bug.id}`} className="hover:underline">{bug.title}</Link>
        </CardTitle>
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
          <ClientTime date={bug.createdAt} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{bug.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4 text-muted-foreground">
           <div className="flex items-center gap-2">
            <ThumbsUp
              className="h-4 w-4"
            />
            <span>{bug._count.upvotes} Upvotes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{bug._count.comments} Comments</span>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/bugs/${bug.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
