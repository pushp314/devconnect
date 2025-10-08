
"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2, Terminal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import Script from 'next/script';

interface PyodidePreviewProps {
    code: string;
}

interface Pyodide {
    runPython: (code: string) => any;
    setStdout: (options: { batched: (output: string) => void }) => void;
    setStderr: (options: { batched: (output: string) => void }) => void;
}

declare global {
    interface Window {
        loadPyodide: () => Promise<Pyodide>;
    }
}

export function PyodidePreview({ code }: PyodidePreviewProps) {
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPyodideLoading, setIsPyodideLoading] = useState(true);
    const pyodide = useRef<Pyodide | null>(null);

    const setupPyodide = async () => {
        try {
            if (window.loadPyodide) {
                const pyodideInstance = await window.loadPyodide();
                pyodide.current = pyodideInstance;
                setIsPyodideLoading(false);
            }
        } catch (e) {
            console.error("Error loading Pyodide:", e);
            setError("Failed to load the Python environment.");
            setIsLoading(false);
            setIsPyodideLoading(false);
        }
    };

    useEffect(() => {
        if (isPyodideLoading && pyodide.current === null) {
            // This component will be mounted only when needed, so we can load the script here.
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
            script.onload = () => {
                setupPyodide();
            };
            script.onerror = () => {
                setError("Failed to load Pyodide script.");
                setIsLoading(false);
                setIsPyodideLoading(false);
            };
            document.body.appendChild(script);
            
            return () => {
                document.body.removeChild(script);
            }
        }
    }, []);

    useEffect(() => {
        if (!isPyodideLoading && pyodide.current) {
            const runCode = async () => {
                setIsLoading(true);
                setOutput([]);
                setError(null);
                
                const pyodideInstance = pyodide.current;
                if (!pyodideInstance) {
                    setError("Pyodide is not initialized.");
                    setIsLoading(false);
                    return;
                }

                try {
                    // Capture stdout
                    pyodideInstance.setStdout({
                        batched: (stdout) => {
                            setOutput(prev => [...prev, stdout]);
                        }
                    });
                     // Capture stderr
                    pyodideInstance.setStderr({
                        batched: (stderr) => {
                             setError(prev => (prev ? prev + '\n' : '') + stderr);
                        }
                    });
                    
                    await pyodideInstance.runPython(code);

                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setIsLoading(false);
                     pyodideInstance.setStdout({}); // Reset stdout
                     pyodideInstance.setStderr({}); // Reset stderr
                }
            };
            runCode();
        }
    }, [code, isPyodideLoading]);

    return (
        <div className="relative h-full w-full flex flex-col">
            {(isLoading || isPyodideLoading) && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm text-muted-foreground mt-2">
                        {isPyodideLoading ? "Loading Python environment..." : "Executing code..."}
                    </p>
                </div>
            )}
             <div className="flex-1 flex flex-col bg-muted h-full p-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-2 mb-2">
                    <Terminal className="h-4 w-4" />
                    <span>Console Output</span>
                </div>
                <ScrollArea className="flex-1">
                    <div className="font-code text-xs space-y-2 p-2">
                         {output.length === 0 && !error && !isLoading && (
                            <p className="text-muted-foreground">No output.</p>
                        )}
                        {output.map((line, index) => (
                             <pre key={`out-${index}`} className="whitespace-pre-wrap">{line}</pre>
                        ))}
                         {error && (
                            <pre className="whitespace-pre-wrap text-destructive">{error}</pre>
                        )}
                    </div>
                </ScrollArea>
             </div>
        </div>
    );
}
