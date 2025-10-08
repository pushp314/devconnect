import { getBugById } from "@/app/actions/bugs";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { UpvoteButton } from "@/components/upvote-button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/comments/comment-section";
import { ClientTime } from "@/components/client-time";

export default async function BugDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const bug = await getBugById(params.id);

  if (!bug) {
    notFound();
  }

  const { reporter, upvotesCount, commentsCount } = bug;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-3xl">{bug.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={reporter.image ?? undefined} alt={reporter.name ?? ""} data-ai-hint="person face" />
                        <AvatarFallback>{reporter.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Link href={`/${reporter.username}`} className="font-semibold hover:underline">
                        {reporter.name}
                    </Link>
                </div>
                <span className="text-sm text-muted-foreground">
                    Reported on <ClientTime date={bug.createdAt} />
                </span>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{bug.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{upvotesCount} Upvotes</span>
                </div>
                 <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{commentsCount} Comments</span>
                </div>
            </div>
            <UpvoteButton bugId={bug.id} isUpvoted={bug.isUpvoted} />
        </CardFooter>
      </Card>
      
      <Separator className="my-8" />
      
      <CommentSection bugId={bug.id} />
    </div>
  );
}
