import { getSnippetById } from "@/app/actions/snippets";
import { notFound } from "next/navigation";
import { SnippetCard } from "@/components/snippet-card";

export default async function SnippetDetailPage({ params }: { params: { id: string } }) {
  const snippet = await getSnippetById(params.id);

  if (!snippet) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <SnippetCard snippet={snippet as any} />
    </div>
  );
}
