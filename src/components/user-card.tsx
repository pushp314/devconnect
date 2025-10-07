import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@prisma/client";
import { FollowButton } from "./follow-button";
import { getUserProfile } from "@/app/actions/users";

interface UserCardProps {
  user: User;
}

export async function UserCard({ user }: UserCardProps) {
    const userInitials = user.name?.split(' ').map(n => n[0]).join('') ?? '';
    
    // We need to get the `isFollowing` status for the button
    const profile = await getUserProfile(user.username!);
    const isFollowing = profile?.isFollowing ?? false;

  return (
    <Card className="text-center transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <Link href={`/profile/${user.username}`} className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face" />
            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="text-lg font-bold font-headline">{user.name}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
          {user.bio}
        </p>
        <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
      </CardContent>
    </Card>
  );
}
