import { SnippetForm } from "@/components/forms/snippet-form";
import { getSnippetById } from "@/app/actions/snippets";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function EditSnippetPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const snippet = await getSnippetById(params.id);

  if (!snippet) {
    notFound();
  }

  if (snippet.authorId !== session.user.id) {
    // Or show an unauthorized page
    redirect("/feed");
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <SnippetForm snippet={snippet} />
    </div>
  );
}
