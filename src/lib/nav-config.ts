import {
  Home,
  Compass,
  SquareCode,
  BookOpen,
  Users,
  Settings,
  Bookmark,
  Code,
  Bug,
  Replace,
  User,
  ShoppingBag,
  ShieldCheck,
  LayoutDashboard,
  Share,
  Sparkles,
} from 'lucide-react';

export const navSections = [
   {
    title: 'Discover',
    items: [
      { label: 'Feed', href: '/feed', icon: Home },
      { label: 'For You', href: '/foryou', icon: Sparkles },
      { label: 'Explore', href: '/explore', icon: Compass },
      { label: 'Docs', href: '/docs', icon: BookOpen },
      { label: 'Community', href: '/community', icon: Users },
    ],
  },
   {
    title: 'Shop',
    items: [
      { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag, secondaryIcon: Share },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Playground', href: '/playground', icon: Code },
      { label: 'Convert', href: '/convert', icon: Replace },
      { label: 'Bugs', href: '/bugs', icon: Bug },
    ],
  },
  {
    title: 'Personal',
    items: [
      { label: 'Profile', href: '/[[username]]', icon: User },
      { label: 'Saved', href: '/saved', icon: Bookmark },
      { label: 'Dashboard', href: '/dashboard/components', icon: LayoutDashboard },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Admin', href: '/admin', icon: ShieldCheck },
    ],
  },
];
