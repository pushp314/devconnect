import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Compass, SquareCode, BookOpen, Users, Settings, Bookmark, Code, Bug } from "lucide-react";

const mainNavLinks = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/playground", icon: Code, label: "Playground" },
  { href: "/components", icon: SquareCode, label: "Components" },
  { href: "/docs", icon: BookOpen, label: "Docs" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/bugs", icon: Bug, label: "Bugs" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
];

const secondaryNavLinks = [
    { href: "/settings", icon: Settings, label: "Settings" },
];

interface MainNavProps {
  isMobile?: boolean;
}

export function MainNav({ isMobile = false }: MainNavProps) {
  if (isMobile) {
    return (
      <nav className="flex flex-col gap-4">
        {mainNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 text-lg font-medium"
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
         <hr className="my-4" />
        {secondaryNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 text-lg font-medium"
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
       <div className="flex flex-col h-full justify-between items-center">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                {mainNavLinks.map((link) => (
                <Tooltip key={link.href}>
                    <TooltipTrigger asChild>
                    <Link
                        href={link.href}
                        className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
                ))}
            </nav>
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                 {secondaryNavLinks.map((link) => (
                <Tooltip key={link.href}>
                    <TooltipTrigger asChild>
                    <Link
                        href={link.href}
                        className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
                ))}
            </nav>
       </div>
    </TooltipProvider>
  );
}
