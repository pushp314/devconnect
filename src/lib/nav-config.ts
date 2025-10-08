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
  PlusCircle,
  FileText,
  User,
  Github,
  GitFork,
  Replace,
} from 'lucide-react';

export const navSections = [
  {
    title: 'Create',
    items: [
      { label: 'New Snippet', href: '/snippets/new', icon: PlusCircle },
      { label: 'New Document', href: '/docs/new', icon: FileText },
    ],
  },
  {
    title: 'Discover',
    items: [
      { label: 'Feed', href: '/feed', icon: Home },
      { label: 'Explore', href: '/explore', icon: Compass },
      { label: 'Components', href: '/components', icon: SquareCode },
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
      { label: 'Saved', href: '/saved', icon: Bookmark },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];
