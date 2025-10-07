"use client";

import { SnippetCard } from "@/components/snippet-card";
import { mockSnippets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { useState } from "react";

export default function FeedPage() {
  const [description, setDescription] = useState("");
  
  // This will be used later for infinite scroll
  const [snippets, setSnippets] = useState(mockSnippets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 container py-8">
      <div className="space-y-6">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
        {/* Placeholder for infinite scroll loading */}
      </div>
      <aside className="hidden md:block">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Wand2 className="h-5 w-5 text-primary" />
              AI Snippet Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe the snippet you want to create..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Button className="w-full">Generate Snippet</Button>
            <div className="mt-4 rounded-lg border bg-muted/50 p-4 min-h-[150px]">
              <p className="text-sm text-muted-foreground">AI output will appear here...</p>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
