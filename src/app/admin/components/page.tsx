import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminComponentsPage() {
    const session = await auth();
    // In a real app, you'd check for an admin role
    if (!session?.user) {
        redirect("/auth/signin");
    }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Admin - Component Approvals</h1>
        <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p>A list of pending components awaiting approval will appear here.</p>
       </div>
    </div>
  );
}