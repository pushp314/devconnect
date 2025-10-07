"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from '@/components/tag-input';
import { createDocument } from '@/app/actions/documents';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function NewDocPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    // Or a loading spinner, or a proper unauthorized message
    router.push('/auth/signin');
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newDoc = await createDocument({ title, slug, content, tags });
      toast({
        title: "Document Published",
        description: "Your document has been successfully published.",
      });
      router.push(`/docs/${newDoc.slug}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish the document. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create a New Document</CardTitle>
          <CardDescription>Share your knowledge with the community by writing an article.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a catchy title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="your-title-will-go-here"
              value={slug}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              placeholder="Write your article content here. Markdown is supported."
              className="font-code min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput id="tags" value={tags} onChange={setTags} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !title || !slug || !content || tags.length === 0}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Publish Document
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
