"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Define navigation items directly inside the client component
const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Approvals",
        href: "/admin/components",
        icon: ShieldCheck,
    },
];

export function AdminSidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={pathname === item.href ? 'default' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.title}
                        </Button>
                    </Link>
                )
            })}
        </nav>
    );
}
