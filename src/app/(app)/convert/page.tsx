"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from 'lucide-react';
import { CodeBlock } from '@/components/code-block';

const languages = ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "HTML", "CSS"];

// Mock function
const convertCodeAction = async ({ code, sourceLang, targetLang }: { code: string; sourceLang: string; targetLang: string; }): Promise<string> => {
    console.log("Converting code:", { code, sourceLang, targetLang });
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulate AI processing
    return `// Converted from ${sourceLang} to ${targetLang}\n// Original code:\n${code.split('\n').map(line => `// ${line}`).join('\n')}\n\n// TODO: Implement conversion logic\n\nfunction convertedCode() {\n  return "This is the converted code in ${targetLang}";\n}`;
};

export default function ConvertPage() {
    const [sourceCode, setSourceCode] = useState('');
    const [convertedCode, setConvertedCode] = useState('');
    const [sourceLang, setSourceLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [isConverting, setIsConverting] = useState(false);

    const handleConvert = async () => {
        if (!sourceCode || !sourceLang || !targetLang) {
            // In a real app, you'd use a toast notification here
            alert("Please fill in all fields.");
            return;
        }
        setIsConverting(true);
        setConvertedCode('');
        const result = await convertCodeAction({ code: sourceCode, sourceLang, targetLang });
        setConvertedCode(result);
        setIsConverting(false);
    };

    return (
        <div className="container py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-headline">AI Code Converter</h1>
                <p className="text-muted-foreground mt-2">Translate code from one language to another using AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Source Code</CardTitle>
                        <CardDescription>Enter the code you want to convert.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSourceLang}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Source Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(lang => (
                                    <SelectItem key={`source-${lang}`} value={lang}>{lang}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            placeholder="Paste your source code here..."
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            rows={15}
                            className="font-code"
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-col items-center gap-8">
                    <Button onClick={handleConvert} disabled={isConverting || !sourceCode || !sourceLang || !targetLang} className="lg:mt-48 w-full max-w-xs">
                        {isConverting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Convert Code
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="font-headline">Converted Code</CardTitle>
                            <CardDescription>The AI-generated code will appear here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Select onValueChange={setTargetLang}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Target Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map(lang => (
                                        <SelectItem key={`target-${lang}`} value={lang}>{lang}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="mt-4 rounded-lg border bg-muted/50 p-4 min-h-[358px]">
                                {isConverting ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : convertedCode ? (
                                    <CodeBlock code={convertedCode} language={targetLang.toLowerCase()} />
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center pt-16">Output will be displayed here.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
