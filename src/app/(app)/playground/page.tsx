"use client";

import * as React from 'react';
import { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import * as LucideReact from 'lucide-react';
import { cn } from '@/lib/utils';

const initialCode = `() => {
    const [count, setCount] = React.useState(0);
    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="font-headline text-2xl">Hello From the Playground!</h3>
            <p className="text-muted-foreground">This is a live React preview. Edit the code to see it change.</p>
            <Button onClick={() => setCount(count + 1)} className="w-48">
                <LucideReact.MousePointerClick className="mr-2" />
                Clicked {count} times
            </Button>
        </div>
    )
}`;

const reactLiveTheme = {
  light: {
    plain: { color: '#393A34', backgroundColor: '#f6f8fa' },
    styles: [ { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#999988', fontStyle: 'italic' } }, { types: ['namespace'], style: { opacity: 0.7 } }, { types: ['string', 'attr-value'], style: { color: '#e3116c' } }, { types: ['punctuation', 'operator'], style: { color: '#393A34' } }, { types: [ 'entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted', ], style: { color: '#36acaa' } }, { types: ['at-rule', 'keyword', 'attr-name', 'selector'], style: { color: '#00a4db' } }, { types: ['function', 'deleted', 'tag'], style: { color: '#d73a49' } }, { types: ['function-variable'], style: { color: '#6f42c1' } }, { types: ['tag', 'selector', 'keyword'], style: { color: '#00009f' } },
    ],
  },
  dark: {
    plain: { color: "#F8F8F2", backgroundColor: "#282A36" },
    styles: [ { types: ["prolog", "constant", "symbol"], style: { color: "rgb(189, 147, 249)" } }, { types: ["builtin", "char", "inserted", "selector", "attr-name"], style: { color: "rgb(80, 250, 123)" } }, { types: ["comment"], style: { color: "rgb(98, 114, 164)", fontStyle: "italic" } }, { types: ["string", "url"], style: { color: "rgb(241, 250, 140)" } }, { types: ["variable"], style: { color: "rgb(255, 184, 108)" } }, { types: ["number", "boolean"], style: { color: "rgb(189, 147, 249)" } }, { types: ["punctuation"], style: { color: "rgb(248, 248, 242)" } }, { types: ["function", "class-name"], style: { color: "rgb(255, 121, 198)" } }, { types: ["tag"], style: { color: "rgb(255, 121, 198)" } }, { types: ["operator", "entity"], style: { color: "rgb(248, 248, 242)" } }, { types: ["keyword"], style: { color: "rgb(255, 121, 198)" } }
    ]
  }
};


export default function PlaygroundPage() {
    const { theme } = useTheme();
    const [code, setCode] = useState(initialCode);

    const scope = {
        React,
        useState,
        ...React,
        Button,
        LucideReact,
        ...LucideReact,
        cn,
    };

    return (
        <LiveProvider code={code} scope={scope} noInline={false}>
            <div className="h-full grid grid-cols-1 lg:grid-cols-2">
                <div className="h-full flex flex-col lg:h-auto lg:min-h-[calc(100vh-8rem)]">
                    <Tabs defaultValue="tsx" className="flex-grow flex flex-col">
                        <TabsList className="m-2 shrink-0">
                            <TabsTrigger value="tsx">React (TSX)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tsx" className="flex-grow relative h-full min-h-[300px] lg:min-h-0">
                             <LiveEditor
                                onChange={setCode}
                                theme={theme === 'dark' ? reactLiveTheme.dark : reactLiveTheme.light}
                                className="absolute inset-0 font-code text-sm !bg-transparent p-4"
                                style={{fontFamily: '"Source Code Pro", monospace'}}
                             />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="relative h-full border-t lg:border-t-0 lg:border-l bg-muted/20 min-h-[300px] lg:min-h-0">
                     <Card className="h-full w-full rounded-none border-0">
                        <CardContent className="p-0 h-full">
                            <LivePreview className="p-8 h-full w-full flex items-center justify-center" />
                        </CardContent>
                    </Card>
                    <LiveError className="absolute bottom-0 left-0 right-0 bg-destructive text-destructive-foreground p-4 text-xs font-mono z-10" />
                </div>
            </div>
        </LiveProvider>
    );
}
