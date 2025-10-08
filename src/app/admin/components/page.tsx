import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPendingComponents } from "@/app/actions/marketplace";
import { AdminComponentCard } from "./_components/admin-component-card";

export default async function AdminComponentsPage() {
    const session = await auth();
    // In a real app, you'd check for an admin role
    if (!session?.user) {
        redirect("/auth/signin");
    }

    const pendingComponents = await getPendingComponents();

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Component Approvals</h1>
        {pendingComponents.length > 0 ? (
             <div className="space-y-6">
                {pendingComponents.map(comp => (
                    <AdminComponentCard key={comp.id} component={comp as any} />
                ))}
            </div>
        ) : (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                <h2 className="text-xl font-semibold">All Clear!</h2>
                <p>There are no pending components awaiting approval.</p>
            </div>
        )}
    </div>
  );
}