"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: { [key: string]: LucideIcon } = {
    LayoutDashboard,
    ShieldCheck,
};

interface AdminSidebarNavProps {
    items: {
        title: string;
        href: string;
        icon: string;
    }[];
}

export function AdminSidebarNav({ items }: AdminSidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {items.map((item) => {
                const Icon = icons[item.icon];
                if (!Icon) return null;

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