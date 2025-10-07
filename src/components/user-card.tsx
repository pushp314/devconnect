"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { UserPlus, UserCheck } from "lucide-react";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="text-center transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <Link href={`/profile/${user.username}`} className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
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
        <Button 
          variant={isFollowing ? 'secondary' : 'default'}
          className="w-full"
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? <UserCheck /> : <UserPlus />}
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
