import { SnippetForm } from "@/components/forms/snippet-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewSnippetPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <SnippetForm />
    </div>
  );
}
