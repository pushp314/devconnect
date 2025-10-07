"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SnippetCard } from "@/components/snippet-card";
import { DocCard } from "@/components/doc-card";
import { mockUsers, mockSnippets, mockDocs } from "@/lib/mock-data";
import { AtSign, UserPlus, UserCheck } from "lucide-react";

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const user = mockUsers.find((u) => u.username === params.userId);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user) {
    notFound();
  }
  
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="container py-8">
      <header className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
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
              <p className="text-2xl font-bold">1.2k</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">480</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
             <Button 
                variant={isFollowing ? 'secondary' : 'default'}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? <UserCheck /> : <UserPlus />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </Button>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockSnippets.filter(s => s.author.id === user.id).map(snippet => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="documents">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDocs.filter(d => d.author.id === user.id).map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="text-center py-16 text-muted-foreground">
            <p>Saved items will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
