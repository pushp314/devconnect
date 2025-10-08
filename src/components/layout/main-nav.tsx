"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { navSections } from '@/lib/nav-config';
import { usePathname } from 'next/navigation';

interface MainNavProps {
  isMobile?: boolean;
}

export function MainNav({ isMobile = false }: MainNavProps) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <nav className="grid items-start gap-2">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="grid gap-1 px-2">
            {section.title && <h2 className="px-4 text-lg font-semibold tracking-tight">{section.title}</h2>}
            {section.items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
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
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid items-start gap-2">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="grid gap-1 px-2">
             {section.title && <h2 className="px-4 text-sm font-semibold tracking-tight text-muted-foreground">{section.title}</h2>}
            {section.items.map((link) => (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      pathname === link.href && 'text-primary bg-muted'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}
