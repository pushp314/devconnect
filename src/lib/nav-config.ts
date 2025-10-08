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
} from 'lucide-react';

export const navSections = [
  {
    title: 'Discover',
    items: [
      { label: 'Feed', href: '/feed', icon: Home },
      { label: 'Explore', href: '/explore', icon: Compass },
      { label: 'Docs', href: '/docs', icon: BookOpen },
      { label: 'Community', href: '/community', icon: Users },
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
      { label: 'Profile', href: '/profile/[[username]]', icon: User },
      { label: 'Saved', href: '/saved', icon: Bookmark },
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Admin', href: '/admin', icon: ShieldCheck },
    ],
  },
];
