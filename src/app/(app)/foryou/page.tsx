import { getRecommendedItems } from "@/app/actions/users";
import { SnippetCard } from "@/components/snippet-card";
import { DocCard } from "@/components/doc-card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default async function ForYouPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/foryou");
  }
  
  const { recommendedSnippets, recommendedDocs } = await getRecommendedItems();
  
  const populatedSnippets = recommendedSnippets as PopulatedSnippet[];
  const populatedDocs = recommendedDocs as PopulatedDoc[];

  const hasRecommendations = populatedSnippets.length > 0 || populatedDocs.length > 0;

  return (
    <div className="container py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight">For You</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Personalized recommendations for snippets and documents based on your interests and activity.
        </p>
      </div>

      {hasRecommendations ? (
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippets">
            {populatedSnippets.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {populatedSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No snippet recommendations for you right now. Like and save more snippets to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents">
            {populatedDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {populatedDocs.map((doc) => (
                  <DocCard key={doc.id} doc={doc as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No document recommendations for you right now. Like and save more documents to get started!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
         <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Start Exploring!</h2>
            <p className="mt-2">We don't have any recommendations for you yet.</p>
            <p>Like and save some snippets or documents to help us learn what you're interested in.</p>
        </div>
      )}
    </div>
  );
}
