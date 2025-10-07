"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSnippetAction } from "@/app/actions/ai";
import { CodeBlock } from "./code-block";

export function AISnippetGenerator() {
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description) {
      toast({
        variant: "destructive",
        title: "Missing description",
        description: "Please describe the snippet you want to create.",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedCode("");
    try {
      const result = await generateSnippetAction({ description });
      setGeneratedCode(result.generatedCode);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate snippet. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
          disabled={isGenerating}
        />
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating && <Loader2 className="animate-spin" />}
          Generate Snippet
        </Button>
        <div className="mt-4 rounded-lg border bg-muted/50 p-2 min-h-[150px]">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : generatedCode ? (
            <CodeBlock code={generatedCode} language="typescript" />
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-16">
              AI output will appear here...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
