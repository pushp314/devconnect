"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from 'lucide-react';
import { explainCodeAction } from '@/app/actions/ai';
import { useToast } from '@/hooks/use-toast';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export function AIExplanationModal({ isOpen, onClose, code }: AIExplanationModalProps) {
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      handleGenerateExplanation();
    } else {
        setExplanation(''); // Clear on close
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleGenerateExplanation = async () => {
    if (!code) {
      toast({ variant: 'destructive', title: "No code provided." });
      return;
    }
    setIsGenerating(true);
    setExplanation('');
    try {
      const result = await explainCodeAction({ code });
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "AI Error",
        description: "Failed to generate explanation. Please try again.",
      });
      onClose(); // Close modal on error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
             <Wand2 className="h-5 w-5 text-primary" />
            AI Code Explanation
          </DialogTitle>
          <DialogDescription>
            Here's a breakdown of the code snippet.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 prose dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">The AI is analyzing the code...</p>
            </div>
          ) : (
             <p>{explanation}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
