"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Eye, Heart } from "lucide-react";
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { useTheme } from 'next-themes';
import { Skeleton } from './ui/skeleton';
import type { Component, User } from '@prisma/client';

interface ComponentCardProps {
  component: Component & { author: User };
}

const reactLiveTheme = {
  light: {
    plain: {
      color: '#393A34',
      backgroundColor: '#f6f8fa',
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
          color: '#999988',
          fontStyle: 'italic',
        },
      },
      {
        types: ['namespace'],
        style: {
          opacity: 0.7,
        },
      },
      {
        types: ['string', 'attr-value'],
        style: {
          color: '#e3116c',
        },
      },
      {
        types: ['punctuation', 'operator'],
        style: {
          color: '#393A34',
        },
      },
      {
        types: [
          'entity',
          'url',
          'symbol',
          'number',
          'boolean',
          'variable',
          'constant',
          'property',
          'regex',
          'inserted',
        ],
        style: {
          color: '#36acaa',
        },
      },
      {
        types: ['at-rule', 'keyword', 'attr-name', 'selector'],
        style: {
          color: '#00a4db',
        },
      },
      {
        types: ['function', 'deleted', 'tag'],
        style: {
          color: '#d73a49',
        },
      },
      {
        types: ['function-variable'],
        style: {
          color: '#6f42c1',
        },
      },
      {
        types: ['tag', 'selector', 'keyword'],
        style: {
          color: '#00009f',
        },
      },
    ],
  },
  dark: {
    plain: {
      color: "#F8F8F2",
      backgroundColor: "#282A36"
    },
    styles: [
      {
        types: ["prolog", "constant", "symbol"],
        style: {
          color: "rgb(189, 147, 249)"
        }
      },
      {
        types: ["builtin", "char", "inserted", "selector", "attr-name"],
        style: {
          color: "rgb(80, 250, 123)"
        }
      },
      {
        types: ["comment"],
        style: {
          color: "rgb(98, 114, 164)",
          fontStyle: "italic"
        }
      },
      {
        types: ["string", "url"],
        style: {
          color: "rgb(241, 250, 140)"
        }
      },
      {
        types: ["variable"],
        style: {
          color: "rgb(255, 184, 108)"
        }
      },
      {
        types: ["number", "boolean"],
        style: {
          color: "rgb(189, 147, 249)"
        }
      },
      {
        types: ["punctuation"],
        style: {
          color: "rgb(248, 248, 242)"
        }
      },
      {
        types: ["function", "class-name"],
        style: {
          color: "rgb(255, 121, 198)"
        }
      },
      {
        types: ["tag"],
        style: {
          color: "rgb(255, 121, 198)"
        }
      },
      {
        types: ["operator", "entity"],
        style: {
          color: "rgb(248, 248, 242)"
        }
      },
      {
        types: ["keyword"],
        style: {
          color: "rgb(255, 121, 198)"
        }
      }
    ]
  }
};


export function ComponentCard({ component }: ComponentCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <LiveProvider code={component.code} scope={{ React, useState, Button }}>
        <div className="relative p-6 border-b min-h-[164px] flex items-center justify-center">
            {mounted ? (
              <LivePreview className="w-full flex items-center justify-center" />
            ) : (
              <Skeleton className="w-full h-24" />
            )}
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{component.name}</CardTitle>
          <p className="text-sm text-muted-foreground pt-2">{component.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {component.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          {showCode && mounted && (
            <div className="mt-4 rounded-md overflow-hidden border">
              <LiveProvider code={component.code} scope={{ React, useState, Button }}>
                <LiveError className="bg-destructive text-destructive-foreground p-4 text-xs font-mono" />
              </LiveProvider>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={component.author.image ?? undefined} alt={component.author.name ?? ''} data-ai-hint="person face" />
                    <AvatarFallback>{component.author.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{component.author.name}</span>
            </div>
            <div className='flex gap-1 text-muted-foreground'>
                <Button variant="ghost" size="sm" onClick={() => setShowCode(!showCode)}>
                    <Code className="h-4 w-4 mr-1" />
                    {showCode ? 'Hide' : 'Show'} Code
                </Button>
                <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    {component.likes}
                </Button>
            </div>
        </CardFooter>
      </LiveProvider>
    </Card>
  );
}
