
"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { toggleFollow } from '@/app/actions/users';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
    targetUserId: string;
    isFollowing: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
    const user = useCurrentUser();
    const router = useRouter();
    const { toast } = useToast();
    
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, setIsPending] = useState(false);

    // Hardcode admin ID to make non-unfollowable
    const adminUserId = "clz7e0k0w00001or8y8u6k3a7"; // This should be the ID of pusprajsharma314@gmail.com

    const handleFollow = async () => {
        if (!user) {
            router.push('/auth/signin');
            return;
        }

        if (user.id === targetUserId) {
            toast({ variant: 'destructive', title: "You can't follow yourself."});
            return;
        }

        setIsPending(true);
        // Optimistic update
        setIsFollowing(!isFollowing);

        try {
            await toggleFollow(targetUserId);
        } catch (error) {
            console.error(error);
            // Revert on error
            setIsFollowing(isFollowing);
            toast({ variant: 'destructive', title: 'Something went wrong.' });
        } finally {
            setIsPending(false);
        }
    }

    if (!user || user.id === targetUserId) {
        return null;
    }
    
    // Do not render the button on the admin's profile page
    if (targetUserId === 'clz7e0k0w00001or8y8u6k3a7') { // Hardcoded ID of admin
        return null;
    }
    
    return (
        <Button 
            variant={isFollowing ? 'secondary' : 'default'}
            onClick={handleFollow}
            disabled={isPending}
            >
            {isPending ? (
                <Loader2 className="animate-spin" />
            ) : isFollowing ? (
                <UserCheck />
            ) : (
                <UserPlus />
            )}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </Button>
    );
}
