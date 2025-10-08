"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from "next-themes";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Code Copied!", description: "The code has been copied to your clipboard." });
  };
  
  const prismTheme = theme === 'dark' ? themes.vsDark : themes.vsLight;

  if (!mounted) {
    return (
      <div className="relative font-code text-sm group">
        <Skeleton className="absolute inset-0 rounded-md" />
      </div>
    );
  }

  return (
    <Highlight
      theme={prismTheme}
      code={code.trim()}
      language={language.toLowerCase()}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="relative font-code text-sm group">
          <pre
            className={className}
            style={{ 
                ...style, 
                backgroundColor: 'transparent',
                padding: '1rem',
                margin: 0,
                overflowX: 'auto',
                borderRadius: '0.375rem',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
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
      )}
    </Highlight>
  );
}
