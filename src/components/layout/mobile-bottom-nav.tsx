'use client';

import { useRouter, usePathname } from 'next/navigation';
import Dock from './dock';
import { navSections } from '@/lib/nav-config';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const allNavItems = navSections.flatMap(section => section.items);

  const dockItems = allNavItems.map(item => ({
    icon: <item.icon size={20} />,
    label: item.label,
    onClick: () => router.push(item.href),
    className: pathname === item.href ? 'bg-primary text-primary-foreground border-primary' : ''
  }));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-24 z-50 pointer-events-none">
       <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
         <Dock items={dockItems} />
       </div>
    </div>
  );
}
