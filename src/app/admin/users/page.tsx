import { getUsersForAdmin } from "@/app/actions/admin";
import { UsersTable } from "./_components/users-table";

export default async function AdminUsersPage() {
    const users = await getUsersForAdmin();

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">User Management</h1>
            <UsersTable users={users} />
        </div>
    )
}
