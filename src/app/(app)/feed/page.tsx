import { SnippetCard } from "@/components/snippet-card";
import { mockSnippets } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <h1 className="font-headline text-3xl font-bold mb-8">Feed</h1>
      <div className="space-y-6">
        {mockSnippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
