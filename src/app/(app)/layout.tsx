import { Header } from "@/components/layout/header";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex">
        <DesktopSidebar />
        <main className="flex-1 py-6 md:pl-[240px]">
          {children}
        </main>
      </div>
       <MobileBottomNav />
    </div>
  );
}
