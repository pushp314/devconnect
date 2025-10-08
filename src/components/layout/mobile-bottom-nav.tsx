'use client';

import {
  Home,
  Compass,
  SquareCode,
  BookOpen,
  Users,
  Code,
  Bug,
  Replace,
  Bookmark,
  User,
  Settings
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Dock from './dock';

const items = [
  { icon: <Home size={18} />, label: 'Feed', href: '/feed' },
  { icon: <Compass size={18} />, label: 'Explore', href: '/explore' },
  { icon: <SquareCode size={18} />, label: 'Components', href: '/components' },
  { icon: <BookOpen size={18} />, label: 'Docs', href: '/docs' },
  { icon: <Users size={18} />, label: 'Community', href: '/community' },
  { icon: <Code size={18} />, label: 'Playground', href: '/playground' },
  { icon: <Replace size={18} />, label: 'Convert', href: '/convert' },
  { icon: <Bug size={18} />, label: 'Bugs', href: '/bugs' },
  { icon: <Bookmark size={18} />, label: 'Saved', href: '/saved' },
  { icon: <User size={18} />, label: 'Profile', href: '/profile/me' },
  { icon: <Settings size={18} />, label: 'Settings', href: '/settings' },
];

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const dockItems = items.map(item => ({
    ...item,
    onClick: () => router.push(item.href),
    className: pathname === item.href ? 'bg-primary text-primary-foreground' : ''
  }));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-24 z-50 pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-background/80 backdrop-blur-xl">
        <Dock items={dock