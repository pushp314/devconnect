import { UserCard } from "@/components/user-card";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/mock-data";
import { Search } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline mb-4">Community</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for developers..."
            className="pl-10 max-w-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
         {mockUsers.map((user) => (
          <UserCard key={`${user.id}-2`} user={user} />
        ))}
      </div>
    </div>
  );
}
