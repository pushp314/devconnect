import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AdminSidebarNav } from "./_components/admin-sidebar-nav";

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: "Approvals",
        href: "/admin/components",
        icon: <ShieldCheck className="h-4 w-4" />,
    },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <aside>
                <h2 className="text-lg font-semibold font-headline mb-4">Admin Menu</h2>
                <AdminSidebarNav items={adminNavItems} />
            </aside>
            <main>
                {children}
            </main>
        </div>
    </div>
  );
}