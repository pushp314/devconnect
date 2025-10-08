"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navSections } from '@/lib/nav-config';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Role } from '@prisma/client';

export function DesktopSidebar() {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <aside className="hidden md:flex flex-col w-[240px] fixed top-16 h-[calc(100vh-4rem)] border-r bg-background/80 backdrop-blur z-40">
        <ScrollArea className="flex-1">
            <nav className="grid items-start gap-4 p-4">
                {navSections.map((section, sectionIndex) => {
                    const sectionHasVisibleItems = section.items.some(link => {
                         if (link.href.includes('[[username]]') && !user) return false;
                         if ((link.label === 'Admin' || link.href === '/admin') && user?.role !== Role.ADMIN) return false;
                         if ((link.label === 'Saved' || link.href === '/saved') && !user) return false;
                         if ((link.label === 'Dashboard' || link.href === '/dashboard/components') && !user) return false;
                         if ((link.label === 'Settings' || link.href === '/settings') && !user) return false;
                         if ((link.label === 'Profile') && !user) return false;
                         return true;
                    });

                    if (!sectionHasVisibleItems) {
                        return null;
                    }

                    return (
                        <div key={sectionIndex} className="grid gap-1">
                            <h2 className="px-2 text-sm font-semibold tracking-tight text-muted-foreground">{section.title}</h2>
                            {section.items.map((link) => {
                              const href = link.href.includes('[[username]]') 
                                ? user?.username ? link.href.replace('[[username]]', user.username) : null
                                : link.href;

                              if (!href) return null;
                              if ((link.label === 'Admin' || link.href === '/admin') && user?.role !== Role.ADMIN) return null;
                              if ((link.label === 'Saved' || link.href === '/saved') && !user) return null;
                              if ((link.label === 'Dashboard' || link.href === '/dashboard/components') && !user) return null;
                              if ((link.label === 'Settings' || link.href === '/settings') && !user) return null;

                              const isActive = pathname.startsWith(link.href);
                              const isMarketplace = link.label === 'Marketplace';
                              const Icon = link.icon;
                              const SecondaryIcon = link.secondaryIcon;

                              return (
                                <Link
                                  key={link.href}
                                  href={href}
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                                    isActive && 'text-primary bg-muted',
                                    isMarketplace && 'bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10'
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="flex-1">{link.label}</span>
                                  {SecondaryIcon && <SecondaryIcon className="h-4 w-4" />}
                                </Link>
                              );
                            })}
                        </div>
                    );
                })}
            </nav>
        </ScrollArea>
    </aside>
  );
}
