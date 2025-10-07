import { getSnippets } from "@/app/actions/snippets";
import { SnippetCard } from "@/components/snippet-card";
import { AISnippetGenerator } from "@/components/ai-snippet-generator";
import type { Snippet, User, Like, Comment } from "@prisma/client";

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
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
      <aside className="hidden md:block">
        <AISnippetGenerator />
      </aside>
    </div>
  );
}
