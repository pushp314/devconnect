
"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { LiveEditor } from 'react-live';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ArrowRight, Loader2 } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';
import { convertCodeAction } from '@/app/actions/ai';
import { useToast } from '@/hooks/use-toast';

const languageSuggestions = {
    "Web": ["JavaScript", "TypeScript", "HTML", "CSS"],
    "Mobile": ["Kotlin", "Swift"],
    "Backend": ["Python", "Java", "Go", "Rust", "C#", "PHP"],
    "Database": ["SQL"],
};

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

export default function ConvertPage() {
    const [sourceCode, setSourceCode] = useState('');
    const [convertedCode, setConvertedCode] = useState('');
    const [sourceLang, setSourceLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const { toast } = useToast();
    const { theme } = useTheme();

    const handleConvert = async () => {
        if (!sourceCode || !sourceLang || !targetLang) {
            toast({
                variant: 'destructive',
                title: "Missing fields",
                description: "Please fill in all fields.",
            });
            return;
        }
        setIsConverting(true);
        setConvertedCode('');
        try {
            const result = await convertCodeAction({ code: sourceCode, sourceLanguage: sourceLang, targetLanguage: targetLang });
            setConvertedCode(result.convertedCode);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "AI Error",
                description: "Failed to convert code. Please try again.",
            });
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="container py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold font-headline tracking-tight">AI Code Converter</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Translate code snippets from one programming language to another using the power of generative AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                {/* Source Column */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-between">
                            <span>Source Code</span>
                             <Select onValueChange={setSourceLang} value={sourceLang}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Source Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(languageSuggestions).map(([group, langs]) => (
                                        <SelectGroup key={`source-${group}`}>
                                            <SelectLabel>{group}</SelectLabel>
                                            {langs.map(lang => (
                                                <SelectItem key={`source-${lang}`} value={lang}>{lang}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-[420px] relative">
                         <LiveEditor
                            value={sourceCode}
                            onValueChange={setSourceCode}
                            theme={theme === 'dark' ? reactLiveTheme.dark : reactLiveTheme.light}
                            className="absolute inset-0 font-code text-sm !bg-transparent p-4 rounded-md border"
                            style={{fontFamily: '"Source Code Pro", monospace'}}
                            padding={16}
                        />
                    </CardContent>
                </Card>

                {/* Action Column */}
                <div className="flex justify-center items-center">
                    <Button 
                        size="lg"
                        onClick={handleConvert} 
                        disabled={isConverting || !sourceCode || !sourceLang || !targetLang} 
                        className="rounded-full w-20 h-20 text-lg"
                    >
                        {isConverting ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <ArrowRight className="h-8 w-8" />
                        )}
                         <span className="sr-only">Convert Code</span>
                    </Button>
                </div>

                {/* Target Column */}
                <Card className="flex flex-col">
                    <CardHeader>
                       <CardTitle className="font-headline flex items-center justify-between">
                            <span>Converted Code</span>
                            <Select onValueChange={setTargetLang} value={targetLang}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Target Language" />
                                </SelectTrigger>
                                <SelectContent>
                                     {Object.entries(languageSuggestions).map(([group, langs]) => (
                                        <SelectGroup key={`target-${group}`}>
                                            <SelectLabel>{group}</SelectLabel>
                                            {langs.map(lang => (
                                                <SelectItem key={`target-${lang}`} value={lang}>{lang}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-[420px]">
                        <div className="rounded-lg border bg-muted/50 p-1 flex-1 relative">
                            {isConverting ? (
                                <div className="flex items-center justify-center h-full flex-col gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Converting code...</p>
                                </div>
                            ) : convertedCode ? (
                                <div className="absolute inset-0">
                                    <CodeBlock code={convertedCode} language={targetLang.toLowerCase()} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-8">
                                    <p className="text-sm text-muted-foreground">The AI-generated code will appear here.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
