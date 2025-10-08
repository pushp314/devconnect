'use client';

import { useRouter, usePathname } from 'next/navigation';
import Dock from './dock';
import { navSections } from '@/lib/nav-config';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Role } from '@prisma/client';

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();

  const allNavItems = navSections.flatMap(section => section.items);

  const dockItems = allNavItems
    .filter(item => {
        if (item.label === 'Admin' && user?.role !== Role.ADMIN) {
            return false;
        }
        return true;
    })
    .map(item => {
    const href = item.href.includes('[[username]]')
        ? user?.username ? item.href.replace('[[username]]', user.username) : '/auth/signin'
        : item.href;
    
    return {
        icon: <item.icon size={20} />,
        label: item.label,
        onClick: () => router.push(href),
        className: pathname === href ? 'bg-primary text-primary-foreground border-primary' : ''
    }
  });

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-24 z-50 pointer-events-none">
       <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
         <Dock items={dockItems} />
       </div>
    </div>
  );
}
