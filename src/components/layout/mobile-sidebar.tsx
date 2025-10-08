"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { navSections } from "@/lib/nav-config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Code, Menu } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Role } from "@prisma/client"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const user = useCurrentUser();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg mb-6"
            onClick={() => setOpen(false)}
        >
            <Code className="w-6 h-6 text-primary" />
            <h1 className="font-headline">CodeStudio</h1>
        </Link>
        <div className="flex flex-col gap-4">
            {navSections.map((section) => {
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
                    <div key={section.title} className="flex flex-col gap-1">
                        <h2 className="text-sm font-semibold tracking-tight text-muted-foreground px-3">
                            {section.title}
                        </h2>
                         {section.items.map((link) => {
                           const href = link.href.includes('[[username]]') 
                            ? user?.username ? link.href.replace('[[username]]', user.username) : null
                            : link.href;
                          
                           if (!href) return null;
                           if ((link.label === 'Admin' || link.href === '/admin') && user?.role !== Role.ADMIN) return null;
                           if ((link.label === 'Saved' || link.href === '/saved') && !user) return null;
                           if ((link.label === 'Dashboard' || link.href === '/dashboard/components') && !user) return null;
                           if ((link.label === 'Settings' || link.href === '/settings') && !user) return null;

                           const isActive = link.href.startsWith('/marketplace')
                            ? pathname.startsWith(link.href)
                            : pathname === href;

                           return (
                            <Link
                                key={link.href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                                isActive && 'text-primary bg-muted'
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                           );
                        })}
                    </div>
                )
            })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
