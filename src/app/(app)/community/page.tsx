import { getUsers } from "@/app/actions/users";
import { UserCard } from "@/components/user-card";
import { CommunitySearch } from "@/components/community-search";
import type { User } from "@prisma/client";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query =
    typeof searchParams.query === "string" ? searchParams.query : undefined;
  const users = (await getUsers({ query })) as User[];

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Community</h1>
        <CommunitySearch />
      </div>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>No developers found.</p>
        </div>
      )}
    </div>
  );
}
