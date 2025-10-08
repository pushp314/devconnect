"use client";

import { useState, useEffect } from 'react';

interface ClientTimeProps {
    date: Date | string;
    format?: Intl.DateTimeFormatOptions;
}

const defaultFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

export function ClientTime({ date, format = defaultFormat }: ClientTimeProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!isClient) {
        // Render a placeholder on the server and during the initial client render
        return <span suppressHydrationWarning>{dateObj.toISOString().split('T')[0]}</span>;
    }

    return (
        <time dateTime={dateObj.toISOString()}>
            {dateObj.toLocaleDateString(undefined, format)}
        </time>
    );
}
