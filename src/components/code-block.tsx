"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here to indicate success
  };

  const backgroundColor = theme === 'dark' ? '#1E1E1E' : '#F5F5F5';
  
  if (!mounted) {
    // Avoid rendering mismatch during server-side rendering
    return <div className="h-48 w-full animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="relative rounded-md font-code text-sm group bg-muted/50">
      <pre 
        className="p-4 rounded-md overflow-x-auto"
        style={{ backgroundColor }}
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
