"use client";

import type { User } from "@prisma/client";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { unblockUser } from "@/app/actions/users";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

interface BlockedUsersListProps {
    initialBlockedUsers: User[];
}

export function BlockedUsersList({ initialBlockedUsers }: BlockedUsersListProps) {
    const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleUnblock = (userId: string) => {
        startTransition(async () => {
            try {
                await unblockUser(userId);
                setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
                toast({ title: "User unblocked" });
            } catch (error) {
                toast({ variant: "destructive", title: "Failed to unblock user" });
            }
        });
    };

    if (blockedUsers.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p>You haven't blocked any users.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blockedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                         <Avatar>
                            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face" />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <Link href={`/${user.username}`} className="font-semibold hover:underline">
                                {user.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>
                     <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnblock(user.id)}
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="animate-spin mr-2" />}
                        Unblock
                    </Button>
                </div>
            ))}
        </div>
    );
}
