"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here to indicate success
  };

  if (!mounted) {
    // Render a server-side placeholder to prevent layout shift
    return (
      <div className="relative rounded-md font-code text-sm group bg-muted/50">
        <pre 
          className="p-4 rounded-md overflow-x-auto"
        >
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
        <Skeleton className="absolute top-2 right-2 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative rounded-md font-code text-sm group bg-muted/50">
      <pre 
        className="p-4 rounded-md overflow-x-auto"
      >
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  );
}
