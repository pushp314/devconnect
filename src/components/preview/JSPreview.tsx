
"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldAlert, Terminal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface JSPreviewProps {
    js: string;
}

interface ConsoleMessage {
    type: 'log' | 'warn' | 'error';
    message: string;
    timestamp: number;
}

const RUNTIME_TIMEOUT = 5000; // 5 seconds

export function JSPreview({ js }: JSPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
    const watchdogTimer = useRef<NodeJS.Timeout | null>(null);
    
    // The HTML document that will host the user's JS
    const srcDoc = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body { font-family: sans-serif; color: white; }
                </style>
            </head>
            <body>
                <script>
                    // 1. Override console methods
                    const originalConsole = { ...console };
                    const postMessageToParent = (type, args) => {
                        try {
                             window.parent.postMessage({
                                type: 'console',
                                level: type,
                                message: args.map(arg => {
                                    if (arg instanceof Error) return arg.stack;
                                    return JSON.parse(JSON.stringify(arg, null, 2));
                                })
                            }, '*');
                        } catch(e) {
                            // Handle circular structures
                             window.parent.postMessage({
                                type: 'console',
                                level: 'error',
                                message: ['Could not serialize message for console.']
                             }, '*');
                        }
                    };
                    
                    console.log = (...args) => { postMessageToParent('log', args); originalConsole.log(...args); };
                    console.warn = (...args) => { postMessageToParent('warn', args); originalConsole.warn(...args); };
                    console.error = (...args) => { postMessageToParent('error', args); originalConsole.error(...args); };

                    window.addEventListener('error', (event) => {
                        postMessageToParent('error', [event.message, 'at', event.filename + ':' + event.lineno]);
                    });

                    // 2. Heartbeat for watchdog
                    window.addEventListener('load', () => {
                         window.parent.postMessage({ type: 'preview-loaded' }, '*');
                    });
                    
                    // 3. Execute user code
                    try {
                        ${js}
                    } catch (e) {
                         postMessageToParent('error', [e]);
                    }
                </script>
            </body>
        </html>
    `;

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        setConsoleMessages([]);
        
        const handleMessage = (event: MessageEvent) => {
            if (iframeRef.current?.contentWindow !== event.source) return;

            if (event.data.type === 'preview-loaded') {
                setIsLoading(false);
                if (watchdogTimer.current) clearTimeout(watchdogTimer.current);
            }
            if (event.data.type === 'console') {
                setConsoleMessages(prev => [...prev, {
                    type: event.data.level,
                    message: event.data.message.map((m: any) => typeof m === 'object' ? JSON.stringify(m, null, 2) : m).join(' '),
                    timestamp: Date.now()
                }]);
            }
        };

        window.addEventListener('message', handleMessage);

        // Runtime watchdog
        watchdogTimer.current = setTimeout(() => {
            setIsLoading(false);
            setError("Preview timed out. This might be due to an infinite loop.");
        }, RUNTIME_TIMEOUT);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (watchdogTimer.current) clearTimeout(watchdogTimer.current);
        };
    }, [js]); // Rerun effect when the JS code changes

    return (
        <div className="relative h-full w-full flex flex-col">
            <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                title="JavaScript Preview"
                sandbox="allow-scripts" // Disallows same-origin, forms, popups etc. by default
                className="w-0 h-0" // The iframe is not visible
            />
            {(isLoading || error) && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                    {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
                    {error && (
                        <>
                            <ShieldAlert className="h-8 w-8 text-destructive" />
                            <p className="mt-2 text-center text-sm font-semibold text-destructive">{error}</p>
                        </>
                    )}
                </div>
            )}
             <div className="flex-1 flex flex-col bg-muted h-full p-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-b pb-2 mb-2">
                    <Terminal className="h-4 w-4" />
                    <span>Console Output</span>
                </div>
                <ScrollArea className="flex-1">
                    <div className="font-code text-xs space-y-2 p-2">
                        {consoleMessages.length === 0 && !isLoading && !error && (
                            <p className="text-muted-foreground">No console output.</p>
                        )}
                        {consoleMessages.map((msg) => (
                            <pre key={msg.timestamp} className={`whitespace-pre-wrap ${msg.type === 'error' ? 'text-destructive' : msg.type === 'warn' ? 'text-yellow-500' : ''}`}>
                                {msg.message}
                            </pre>
                        ))}
                    </div>
                </ScrollArea>
             </div>
        </div>
    );
}
