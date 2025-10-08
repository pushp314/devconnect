"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navSections } from '@/lib/nav-config';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ShoppingBag } from 'lucide-react';

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] fixed top-16 h-[calc(100vh-4rem)] border-r bg-background/80 backdrop-blur z-40">
        <ScrollArea className="flex-1">
            <nav className="grid items-start gap-4 p-4">
              <Button asChild variant={pathname.startsWith('/marketplace') ? 'default' : 'outline'}>
                  <Link href="/marketplace" className='flex items-center gap-3 justify-start'>
                    <ShoppingBag className="h-4 w-4" />
                    Marketplace
                  </Link>
              </Button>
                {navSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="grid gap-1">
                    <h2 className="px-2 text-sm font-semibold tracking-tight text-muted-foreground">{section.title}</h2>
                    {section.items.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                        pathname === link.href && 'text-primary bg-muted'
                        )}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </Link>
                    ))}
                </div>
                ))}
            </nav>
        </ScrollArea>
    </aside>
  );
}
