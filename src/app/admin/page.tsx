import { getAdminDashboardAnalytics } from "../actions/admin";
import { AnalyticsCard } from "./_components/analytics-card";
import { DollarSign, PackageCheck, PackageClock, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await auth();
    // In a real app, you'd check for an admin role
    if (!session?.user) {
        redirect("/auth/signin");
    }

    const analytics = await getAdminDashboardAnalytics();

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                    title="Total Revenue"
                    value={`₹${analytics.totalRevenue.toFixed(2)}`}
                    icon={<DollarSign />}
                    description="Total amount from all sales"
                />
                <AnalyticsCard
                    title="Total Sales"
                    value={analytics.totalSales}
                    icon={<PackageCheck />}
                    description="Total number of components sold"
                />
                <AnalyticsCard
                    title="Pending Approvals"
                    value={analytics.pendingComponents}
                    icon={<PackageClock />}
                    description="Components waiting for review"
                />
                <AnalyticsCard
                    title="Total Users"
                    value={analytics.totalUsers}
                    icon={<Users />}
                    description="Total registered users"
                />
            </div>
             <div className="mt-8">
                {/* Future content can go here, e.g., charts or recent activity */}
            </div>
        </div>
    );
}