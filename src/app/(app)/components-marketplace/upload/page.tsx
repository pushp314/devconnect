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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from '@/components/tag-input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from "react";
import { uploadComponent } from "@/app/actions/marketplace";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(1000),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  tags: z.array(z.string()).min(1, "Please add at least one tag.").max(10),
  previewImages: z.custom<FileList>().refine(files => files.length > 0, 'At least one preview image is required.'),
  componentZip: z.custom<FileList>().refine(files => files.length === 1, 'A single ZIP file is required.'),
  livePreviewUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export default function UploadComponentPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      tags: [],
      livePreviewUrl: "",
    },
  });
  
  if (!user) {
    router.push('/auth/signin?callbackUrl=/components-marketplace/upload');
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    
    // Append preview images
    Array.from(values.previewImages).forEach(file => {
        formData.append('previewImages', file);
    });

    // Append component zip
    formData.append('componentZip', values.componentZip[0]);

    try {
      // 1. Upload files via API route
      const uploadResponse = await fetch('/api/components/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed.');
      }

      const uploadResult = await uploadResponse.json();
      const { previewUrls, zipFileUrl } = uploadResult;

      // 2. Call server action with file URLs and other data
      await uploadComponent({
        title: values.title,
        description: values.description,
        price: values.price,
        tags: values.tags,
        previewUrls: previewUrls,
        zipFileUrl: zipFileUrl,
        livePreviewUrl: values.livePreviewUrl,
      });

      toast({
        title: "Component Submitted!",
        description: "Your component is now pending admin approval.",
      });
      router.push('/components-marketplace');

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: (error as Error).message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Upload a New Component</CardTitle>
          <CardDescription>Share your creation with the community. It will be reviewed by an admin before publishing.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Animated Button" {...field} /></FormControl>
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
                    <FormControl><Textarea placeholder="Describe what your component does..." {...field} rows={5} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl><Input type="number" min="0" step="1" placeholder="Enter 0 for a free component" {...field} /></FormControl>
                     <FormDescription>Enter 0 for a free component. Payment processing is in test mode.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl><TagInput {...field} /></FormControl>
                     <FormDescription>Add relevant tags to help others find your component.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="previewImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Images</FormLabel>
                    <FormControl><Input type="file" accept="image/*" multiple {...form.register('previewImages')} /></FormControl>
                     <FormDescription>Upload one or more screenshots of your component.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="componentZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component File (ZIP)</FormLabel>
                    <FormControl><Input type="file" accept=".zip" {...form.register('componentZip')} /></FormControl>
                     <FormDescription>Package your component code in a single ZIP file.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="livePreviewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Preview URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://your-live-preview.com" {...field} /></FormControl>
                    <FormDescription>Link to a live demo of your component (e.g., on CodeSandbox, StackBlitz).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
                 <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Submit for Review
                </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
