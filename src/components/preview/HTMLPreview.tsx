
"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';

interface HTMLPreviewProps {
    html: string;
}

const RUNTIME_TIMEOUT = 5000; // 5 seconds

export function HTMLPreview({ html }: HTMLPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const watchdogTimer = useRef<NodeJS.Timeout | null>(null);
    
    // Construct the full HTML document for the iframe
    const srcDoc = `
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-transparent">
                ${html}
                <script>
                    // Simple heartbeat to let the parent know the iframe is alive
                    window.addEventListener('load', () => {
                         window.parent.postMessage({ type: 'preview-loaded' }, '*');
                    });
                </script>
            </body>
        </html>
    `;

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        const handleMessage = (event: MessageEvent) => {
            if (iframeRef.current?.contentWindow !== event.source) {
                return;
            }
            if (event.data.type === 'preview-loaded') {
                setIsLoading(false);
                if (watchdogTimer.current) {
                    clearTimeout(watchdogTimer.current);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        // Runtime watchdog
        watchdogTimer.current = setTimeout(() => {
            setIsLoading(false);
            setError("Preview timed out. This might be due to an infinite loop or heavy script.");
        }, RUNTIME_TIMEOUT);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (watchdogTimer.current) {
                clearTimeout(watchdogTimer.current);
            }
        };
    }, [srcDoc]);


    return (
        <div className="relative h-full w-full">
            {isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
             {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4">
                    <ShieldAlert className="h-8 w-8 text-destructive" />
                    <p className="mt-2 text-center text-sm font-semibold text-destructive">{error}</p>
                </div>
            )}
            <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                title="HTML Preview"
                sandbox="allow-scripts" // Disallows same-origin, forms, popups etc. by default
                className={`h-full w-full bg-transparent transition-opacity duration-300 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
            />
        </div>
    );
}

