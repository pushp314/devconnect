
"use client";

import { SnippetCard } from "@/components/snippet-card";
import { DocCard } from "@/components/doc-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSnippets, mockDocs } from "@/lib/mock-data";

export default function SavedPage() {

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Saved Items</h1>
      <Tabs defaultValue="snippets" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-2 mb-8">
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="snippets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockSnippets.slice(0,2).map(snippet => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="documents">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDocs.slice(0,1).map(doc => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
