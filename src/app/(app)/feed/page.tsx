import { getSnippets } from "@/app/actions/snippets";
import { SnippetCard } from "@/components/snippet-card";
import { AISnippetGenerator } from "@/components/ai-snippet-generator";
import type { Snippet, User, Like, Comment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { FollowOnGitHubCard } from "@/components/follow-on-github-card";

type PopulatedSnippet = Snippet & {
  author: User;
  likes: Like[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
};

export default async function FeedPage() {
  const snippets = (await getSnippets({})) as PopulatedSnippet[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 container py-8">
      <div className="space-y-6">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No snippets yet</h2>
            <p className="mt-2 mb-4">Be the first to share a code snippet with the community!</p>
            <Button asChild>
                <Link href="/snippets/new">
                    <PlusCircle className="mr-2" />
                    Create a Snippet
                </Link>
            </Button>
          </div>
        )}
      </div>
      <aside className="hidden md:block sticky top-20 h-fit space-y-6">
        <FollowOnGitHubCard />
        <AISnippetGenerator />
      </aside>
    </div>
  );
}
