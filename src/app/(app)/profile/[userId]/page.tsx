import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SnippetCard } from "@/components/snippet-card";
import { DocCard } from "@/components/doc-card";
import { AtSign } from "lucide-react";
import { getUserProfile } from "@/app/actions/users";
import type { User, Snippet, Document as DocType, Like, Comment } from "@prisma/client";
import { FollowButton } from "@/components/follow-button";

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


export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const profile = await getUserProfile(params.userId);

  if (!profile) {
    notFound();
  }
  
  const user = profile as User;
  const userInitials = user.name?.split(' ').map(n => n[0]).join('') ?? '';
  const snippets = profile.snippets as PopulatedSnippet[];
  const documents = profile.documents as PopulatedDoc[];

  // This would also come from the DB in a real app
  const savedSnippets = (profile.savedSnippets?.map(s => s.snippet) ?? []) as PopulatedSnippet[];
  const savedDocuments = (profile.savedDocuments?.map(d => d.document) ?? []) as PopulatedDoc[];


  return (
    <div className="container py-8">
      <header className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face" />
          <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
             <AtSign className="h-4 w-4" />
            <span>{user.username}</span>
          </div>
          <p className="mt-3 max-w-xl mx-auto md:mx-0">{user.bio}</p>
          <div className="mt-4 flex items-center justify-center md:justify-start gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.followersCount}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile.followingCount}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
             <FollowButton
                targetUserId={user.id}
                isFollowing={profile.isFollowing}
             />
          </div>
        </div>
      </header>

      <Tabs defaultValue="snippets" className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="snippets">
          {snippets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {snippets.map(snippet => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
                <p>This user hasn't posted any snippets yet.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="documents">
           {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map(doc => (
                    <DocCard key={doc.id} doc={doc} />
                ))}
            </div>
           ) : (
             <div className="text-center py-16 text-muted-foreground">
                <p>This user hasn't published any documents yet.</p>
            </div>
           )}
        </TabsContent>
        <TabsContent value="saved">
          <Tabs defaultValue="saved-snippets" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="saved-snippets">Snippets</TabsTrigger>
                <TabsTrigger value="saved-documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="saved-snippets">
                {savedSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {savedSnippets.map(snippet => (
                            <SnippetCard key={snippet.id} snippet={snippet} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Saved snippets will appear here.</p>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="saved-documents">
                 {savedDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedDocuments.map(doc => (
                            <DocCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                 ) : (
                     <div className="text-center py-16 text-muted-foreground">
                        <p>Saved documents will appear here.</p>
                    </div>
                 )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
