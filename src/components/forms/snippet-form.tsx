"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { TagInput } from '@/components/tag-input';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiSnippetTagging } from '@/ai/flows/ai-snippet-tagging';
import { useState } from "react";
import { createSnippet, updateSnippet } from "@/app/actions/snippets";
import { useRouter } from "next/navigation";
import type { Snippet } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const previewLanguages = ["React", "HTML", "JavaScript", "Python"];
const codeOnlyLanguages = ["TypeScript", "Go", "Rust", "Java", "C#"];


const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  language: z.string({ required_error: "Please select a language." }),
  code: z.string().min(10, "Code snippet must have at least 10 characters."),
  tags: z.array(z.string()).min(1, "Please add at least one tag.").max(10),
});

interface SnippetFormProps {
    snippet?: Snippet;
}

export function SnippetForm({ snippet }: SnippetFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const isEditMode = !!snippet;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: snippet?.title || "",
      description: snippet?.description || "",
      language: snippet?.language || undefined,
      code: snippet?.code || "",
      tags: snippet?.tags || [],
    },
  });

  const selectedLanguage = form.watch("language");
  const isPreviewAvailable = previewLanguages.includes(selectedLanguage);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditMode) {
            await updateSnippet({ id: snippet.id, ...values });
             toast({
                title: "Snippet Updated!",
                description: "Your snippet has been successfully updated.",
            });
            router.push('/feed'); // Or back to the snippet page
        } else {
            await createSnippet(values);
            toast({
                title: "Snippet Published!",
                description: "Your new code snippet has been shared with the community.",
            });
            router.push('/feed');
        }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `Error ${isEditMode ? 'updating' : 'publishing'} snippet`,
        description: (error as Error).message,
      });
    }
  }
  
  const handleGenerateTags = async () => {
    const { description, code } = form.getValues();
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
      const currentTags = form.getValues("tags") || [];
      const newTags = result.tags.filter(tag => !currentTags.includes(tag));
      form.setValue("tags", [...currentTags, ...newTags]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate tags. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{isEditMode ? 'Edit Snippet' : 'Share a New Snippet'}</CardTitle>
          <CardDescription>{isEditMode ? 'Update the details of your snippet.' : 'Share your code with the community. Some languages support live previews.'}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React Debounce Hook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What does this code snippet do?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Live Preview Available</SelectLabel>
                            {previewLanguages.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                        </SelectGroup>
                        <SelectGroup>
                             <SelectLabel>Code Only</SelectLabel>
                            {codeOnlyLanguages.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {isPreviewAvailable && (
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle className="font-headline">Live Preview Safety</AlertTitle>
                    <AlertDescription className="text-xs">
                     For security, live previews run in a sandbox. Network requests, cookies, and other sensitive APIs are disabled.
                     {selectedLanguage === 'Python' && " Note: The Python environment may take a moment to load the first time."}
                    </AlertDescription>
                  </Alert>
                )}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                       <Textarea
                        placeholder="Paste your code here..."
                        className="font-code min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                     {isPreviewAvailable 
                        ? 'Your code must be a valid, self-contained component or script. TailwindCSS classes are supported for HTML/React.'
                        : 'Your code will be displayed as a static, read-only block.'
                     }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                       <FormLabel>Tags</FormLabel>
                       <Button type="button" variant="ghost" size="sm" onClick={handleGenerateTags} disabled={isGenerating || form.formState.isSubmitting}>
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                    <FormControl>
                      <TagInput {...field} />
                    </FormControl>
                    <FormDescription>
                      Add up to 10 tags. Press Enter or comma to add a new tag.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                {isEditMode ? 'Save Changes' : 'Publish Snippet'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
  );
}
