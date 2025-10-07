import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Compass, SquareCode, BookOpen, Users, Bug, FlaskConical, GitBranch, Bookmark } from "lucide-react";

const mainNavLinks = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/components", icon: SquareCode, label: "Components" },
  { href: "/docs", icon: BookOpen, label: "Docs" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/bugs", icon: Bug, label: "Bugs" },
  { href: "/playground", icon: FlaskConical, label: "Playground" },
  { href: "/convert", icon: GitBranch, label: "Convert" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
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
      </nav>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="hidden md:flex flex-col items-center gap-4 px-2 sm:py-5">
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
    </TooltipProvider>
  );
}
