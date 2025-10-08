"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navSections } from '@/lib/nav-config';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export function MobileBottomNav() {
  const pathname = usePathname();
  const allNavItems = navSections.flatMap(section => section.items);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur border-t z-50">
      <ScrollArea className="w-full h-full">
        <div className="flex h-full items-center px-4">
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center h-full w-20 flex-shrink-0 gap-1 text-xs text-muted-foreground transition-all',
                pathname === item.href ? 'text-primary' : 'hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
