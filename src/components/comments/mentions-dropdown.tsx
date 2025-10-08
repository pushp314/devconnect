"use client";

import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "../ui/card";

interface MentionsDropdownProps {
  users: User[];
  onSelect: (username: string) => void;
}

export function MentionsDropdown({ users, onSelect }: MentionsDropdownProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <Card className="absolute bottom-full mb-2 w-full max-w-sm max-h-60 overflow-y-auto z-10">
      <CardContent className="p-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => onSelect(user.username!)}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} data-ai-hint="person face" />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-sm text-muted-foreground">@{user.username}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
