import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="fixed top-16 -translate-x-full h-[calc(100vh-4rem)] w-full border-r md:sticky md:block md:translate-x-0">
            <div className="relative h-full py-6 pr-6 lg:py-8">
                <MainNav />
            </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
