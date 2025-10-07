import type { Snippet, User } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Elena overstated', username: 'elena', avatarUrl: 'https://picsum.photos/seed/tech-dev1/40/40', bio: 'Full-stack developer with a passion for open-source and elegant code.' },
  { id: '2', name: 'Ben Carter', username: 'bencarter', avatarUrl: 'https://picsum.photos/seed/coder-2/40/40', bio: 'Frontend wizard, React enthusiast, and UI/UX advocate.' },
  { id: '3', name: 'Mei Lin', username: 'meilin', avatarUrl: 'https://picsum.photos/seed/dev-3/40/40', bio: 'Data scientist and Pythonista. Turning data into stories.' },
  { id: '4', name: 'Chris Rodriguez', username: 'chris_r', avatarUrl: 'https://picsum.photos/seed/hacker-gal/40/40', bio: 'DevOps engineer and cloud infrastructure expert.' },
];

export const mockSnippets: Snippet[] = [
  {
    id: 'snip_1',
    author: mockUsers[1],
    description: "A custom React hook for debouncing input. Useful for search bars or other inputs that trigger expensive operations.",
    code: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    language: 'TypeScript',
    tags: ['react', 'hooks', 'typescript', 'debounce'],
    likes: 128,
    commentsCount: 12,
    createdAt: '2 hours ago',
  },
  {
    id: 'snip_2',
    author: mockUsers[0],
    description: "A simple Python script to organize files in a directory by their extension. Quick and dirty way to clean up your 'Downloads' folder.",
    code: `import os
import shutil

def organize_directory(path):
    files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    
    for file in files:
        extension = file.split('.')[-1]
        if extension:
            target_dir = os.path.join(path, extension)
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            shutil.move(os.path.join(path, file), os.path.join(target_dir, file))

# Example usage:
# organize_directory('/path/to/your/downloads')
`,
    language: 'Python',
    tags: ['python', 'automation', 'file-management'],
    likes: 42,
    commentsCount: 5,
    createdAt: '1 day ago',
  },
    {
    id: 'snip_3',
    author: mockUsers[2],
    description: "An elegant way to fetch data in Next.js 14 using Server Actions and display a loading state. This simplifies client-side logic significantly.",
    code: `// app/actions.ts
'use server'
export async function fetchData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

// app/page.tsx
import { fetchData } from './actions'
export default async function Page() {
  const data = await fetchData()
  return <div>{JSON.stringify(data)}</div>
}`,
    language: 'TypeScript',
    tags: ['nextjs', 'server-actions', 'data-fetching'],
    likes: 256,
    commentsCount: 28,
    createdAt: '3 days ago',
  },
];
