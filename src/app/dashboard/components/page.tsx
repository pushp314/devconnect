import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardComponentsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">My Components</h1>
       <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p>Your purchased and uploaded components will appear here.</p>
       </div>
    </div>
  );
}