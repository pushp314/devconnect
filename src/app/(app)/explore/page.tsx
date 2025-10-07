import { SnippetCard } from "@/components/snippet-card";
import { getSnippets } from "@/app/actions/snippets";
import { ExploreControls } from "@/components/explore-controls";
import type { Snippet, User, Like, Comment } from "@prisma/client";

type PopulatedSnippet = Snippet & {
  author: User;
  likes: Like[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const lang =
    typeof searchParams.lang === "string" ? searchParams.lang : undefined;
  const sortBy =
    typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest";

  const snippets = (await getSnippets({
    language: lang,
    sortBy: sortBy as any,
  })) as PopulatedSnippet[];

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline">Explore Snippets</h1>
        <ExploreControls />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
