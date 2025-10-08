import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@prisma/client";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface UserCardProps {
  user: User;
}

export async function UserCard({ user }: UserCardProps) {
    const userInitials = user.name?.split(' ').map(n => n[0]).join('') ?? '';

  return (
    <Card className="text-center transition-all hover:shadow-lg hover:border-primary/50 flex flex-col">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
            <Link href={`/${user.username}`}>
                <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? ''} data-ai-hint="person face" />
                    <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
            </Link>
            <div>
                <Link href={`/${user.username}`}>
                    <h3 className="text-lg font-bold font-headline hover:underline">{user.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden text-ellipsis">
          {user.bio}
        </p>
        <div className="mt-auto">
            <Button asChild variant="outline" size="sm">
                <Link href={`/${user.username}`}>
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
