import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 items-start md:grid md:grid-cols-[80px_minmax(0,1fr)]">
        <aside className="fixed top-16 -translate-x-full h-[calc(100vh-4rem)] w-full border-r bg-background/80 backdrop-blur md:sticky md:block md:translate-x-0 md:w-[80px]">
            <div className="relative h-full py-6 lg:py-8">
                <MainNav />
            </div>
        </aside>
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
