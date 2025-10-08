"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { submitReview } from "@/app/actions/marketplace";
import type { Review } from "@prisma/client";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required."),
  text: z.string().min(10, 'Review must be at least 10 characters.').max(1000).optional(),
});

interface ReviewFormProps {
    componentId: string;
    existingReview?: Review;
}

export function ReviewForm({ componentId, existingReview }: ReviewFormProps) {
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      text: existingReview?.text || "",
    },
  });
  
  const rating = form.watch("rating");

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    try {
      await submitReview({ componentId, ...values });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: (error as Error).message || "Something went wrong.",
      });
    }
  }

  return (
    <Card className="bg-muted/50">
        <CardHeader>
            <CardTitle className="font-headline text-lg">
                {existingReview ? 'Update Your Review' : 'Write a Review'}
            </CardTitle>
        </CardHeader>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Rating</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "h-6 w-6 cursor-pointer transition-colors",
                                                (hoverRating >= star || rating >= star)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-muted-foreground"
                                            )}
                                            onClick={() => form.setValue('rating', star, { shouldValidate: true })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Review</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell others what you think about this component..."
                                    rows={4}
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
                        {existingReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                </CardContent>
            </form>
        </Form>
    </Card>
  )
}
