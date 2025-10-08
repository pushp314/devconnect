import Link from "next/link";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Code, PlusCircle, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "./notification-bell";
import { auth } from "@/lib/auth";
import { MainNav } from "./main-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/feed" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              CodeStudio
            </span>
          </Link>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 pt-12">
            <Link href="/feed" className="flex items-center space-x-2 mb-6 px-4">
                <Code className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">
                CodeStudio
                </span>
            </Link>
            <div className="h-[calc(100vh-8rem)] overflow-y-auto">
              <MainNav isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {session?.user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create
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
