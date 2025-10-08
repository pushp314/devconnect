import Link from "next/link";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Code, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./notification-bell";
import { auth } from "@/lib/auth";
import { MobileSidebar } from "./mobile-sidebar";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <MobileSidebar />
          <Link href="/feed" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              CodeStudio
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {session?.user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <PlusCircle className="h-4 w-4 mr-0 sm:mr-2" />
                      <span className="hidden sm:inline">Create</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/snippets/new">New Snippet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/docs/new">New Document</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link href="/bugs">Report a Bug</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <NotificationBell />
              </>
            )}

            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
