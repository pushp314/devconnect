"use client";

import { LiveProvider, LiveError, LivePreview } from 'react-live';
import * as LucideReact from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ReactLivePreviewProps {
    code: string;
}

const reactLiveScope = {
    React,
    useState,
    ...React,
    ...LucideReact,
    Button,
    cn,
};

export function ReactLivePreview({ code }: ReactLivePreviewProps) {
    const { theme } = useTheme();

    return (
        <LiveProvider code={code} scope={reactLiveScope} noInline={true} theme={theme === 'dark' ? { plain: {}, styles: [] } : undefined}>
            <LivePreview className="p-4 h-full w-full flex items-center justify-center" />
            <LiveError className="absolute bottom-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-xs font-mono z-10" />
        </LiveProvider>
    );
}
