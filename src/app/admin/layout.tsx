import { AdminSidebarNav } from "./_components/admin-sidebar-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <aside>
                <h2 className="text-lg font-semibold font-headline mb-4">Admin Menu</h2>
                <AdminSidebarNav />
            </aside>
            <main>
                {children}
            </main>
        </div>
    </div>
  );
}
