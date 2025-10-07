import Link from "next/link";
import { cn } from "@/lib/utils";

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      <Link
        href="/feed"
        className="transition-colors hover:text-primary"
      >
        Feed
      </Link>
      <Link
        href="/saved"
        className="text-foreground/60 transition-colors hover:text-primary"
      >
        Saved
      </Link>
      <Link
        href="/explore"
        className="text-foreground/60 transition-colors hover:text-primary"
      >
        Explore
      </Link>
    </nav>
  );
}
