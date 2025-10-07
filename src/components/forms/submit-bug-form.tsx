"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reportBug } from "@/app/actions/bugs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SubmitBugForm() {
  const user = useCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in to report a bug.'});
        router.push('/auth/signin');
        return;
    }

    setIsSubmitting(true);
    try {
      await reportBug({ title, description });
      toast({
        title: "Bug Report Submitted",
        description: "Thanks for helping us improve!",
      });
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit bug report.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Report a New Bug</CardTitle>
        <CardDescription>Found an issue? Let us know!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            placeholder="Bug title or summary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Textarea
            placeholder="Describe the bug in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || !title || !description}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            Submit Report
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
