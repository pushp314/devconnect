"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from '@/components/tag-input';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiSnippetTagging } from '@/ai/flows/ai-snippet-tagging';

const languages = ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "Go", "Rust", "Java", "C#"];

export default function NewSnippetPage() {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const handleGenerateTags = async () => {
    if (!description || !code) {
      toast({
        variant: "destructive",
        title: "Missing Content",
        description: "Please provide a description and code snippet to generate tags.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await aiSnippetTagging({ description, code });
      const newTags = result.tags.filter(tag => !tags.includes(tag));
      setTags([...tags, ...newTags]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate tags. Please try again.",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Share a New Snippet</CardTitle>
          <CardDescription>Fill out the details below to share your code with the community.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What does this code snippet do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Textarea
              id="code"
              placeholder="Paste your code here."
              className="font-code min-h-[200px]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags">Tags</Label>
              <Button type="button" variant="ghost" size="sm" onClick={handleGenerateTags} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                )}
                Generate with AI
              </Button>
            </div>
            <TagInput id="tags" value={tags} onChange={setTags} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto">Publish Snippet</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
