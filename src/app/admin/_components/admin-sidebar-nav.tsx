"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarNavProps {
    items: {
        title: string;
        href: string;
        icon: React.ElementType;
    }[];
}

export function AdminSidebarNav({ items }: AdminSidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {items.map((item) => {
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
