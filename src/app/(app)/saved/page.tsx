import { SnippetCard } from "@/components/snippet-card";
import { DocCard } from "@/components/doc-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSavedItems } from "@/app/actions/users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Snippet, User, Like, Comment, Document as DocType } from "@prisma/client";

type PopulatedSnippet = Snippet & {
  author: User;
  likes: Like[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
};

type PopulatedDoc = DocType & {
  author: User;
  likes: Like[];
  comments: Comment[];
};


export default async function SavedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { savedSnippets, savedDocuments } = await getSavedItems();
  const populatedSnippets = savedSnippets as PopulatedSnippet[];
  const populatedDocs = savedDocuments as PopulatedDoc[];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Saved Items</h1>
      <Tabs defaultValue="snippets" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-2 mb-8">
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="snippets">
          {populatedSnippets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {populatedSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>You haven't saved any snippets yet.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents">
          {populatedDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {populatedDocs.map((doc) => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>You haven't saved any documents yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
