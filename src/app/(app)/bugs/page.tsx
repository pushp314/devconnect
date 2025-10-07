"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { mockBugs } from '@/lib/mock-data';
import type { BugReport } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function BugReportCard({ bug }: { bug: BugReport }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline text-xl'>{bug.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={bug.reporter.avatarUrl} alt={bug.reporter.name} data-ai-hint="person face" />
                        <AvatarFallback>{bug.reporter.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Link href={`/profile/${bug.reporter.username}`} className="font-semibold hover:underline">
                        {bug.reporter.name}
                    </Link>
                    <span className="mx-1">·</span>
                    <time dateTime={bug.createdAt}>{bug.createdAt}</time>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{bug.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <div className="flex gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{bug.upvotes} Upvotes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{bug.commentsCount} Comments</span>
                    </div>
                </div>
                <Button variant="outline">View Details</Button>
            </CardFooter>
        </Card>
    )
}


export default function BugsPage() {
    const [bugs, setBugs] = useState<BugReport[]>(mockBugs);
    const [newBugTitle, setNewBugTitle] = useState('');
    const [newBugDescription, setNewBugDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        console.log({ title: newBugTitle, description: newBugDescription });
        setNewBugTitle('');
        setNewBugDescription('');
    };

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold font-headline mb-6">Bug Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                <div className="space-y-6">
                    {bugs.map((bug) => (
                        <BugReportCard key={bug.id} bug={bug} />
                    ))}
                </div>

                <aside className="sticky top-20 h-fit">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Report a New Bug</CardTitle>
                            <CardDescription>Found an issue? Let us know!</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Bug title or summary"
                                    value={newBugTitle}
                                    onChange={(e) => setNewBugTitle(e.target.value)}
                                    required
                                />
                                <Textarea
                                    placeholder="Describe the bug in detail..."
                                    value={newBugDescription}
                                    onChange={(e) => setNewBugDescription(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Submit Report</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
