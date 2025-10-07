import type { Snippet, User, UIComponent, Doc, BugReport } from './types';

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
    title: 'React Debounce Hook',
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
    language: 'typescript',
    tags: ['react', 'hooks', 'typescript', 'debounce'],
    likes: 128,
    commentsCount: 12,
    createdAt: '2 hours ago',
  },
  {
    id: 'snip_2',
    author: mockUsers[0],
    title: 'Python File Organizer',
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
    language: 'python',
    tags: ['python', 'automation', 'file-management'],
    likes: 42,
    commentsCount: 5,
    createdAt: '1 day ago',
  },
    {
    id: 'snip_3',
    author: mockUsers[2],
    title: 'Next.js 14 Data Fetching',
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
    language: 'typescript',
    tags: ['nextjs', 'server-actions', 'data-fetching'],
    likes: 256,
    commentsCount: 28,
    createdAt: '3 days ago',
  },
];

export const mockComponents: UIComponent[] = [
  {
    id: 'comp_1',
    name: 'Pulsing Button',
    description: 'A button with a subtle pulsing animation to draw attention. Great for primary calls-to-action.',
    author: mockUsers[0],
    code: `() => {
  const [count, setCount] = React.useState(0);
  return (
    <button 
      onClick={() => setCount(c => c + 1)}
      className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg animate-pulse"
    >
      Clicked {count} times
    </button>
  );
}`,
    tags: ['button', 'animation', 'tailwind'],
    likes: 88,
    createdAt: '5 days ago',
  },
  {
    id: 'comp_2',
    name: 'Gradient Card',
    description: 'A card component with a beautiful gradient border and a glassmorphism effect. Perfect for showcasing featured content.',
    author: mockUsers[1],
    code: `() => (
  <div className="relative p-8 rounded-lg bg-background/50 backdrop-blur-sm border border-transparent 
                 before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] 
                 before:bg-gradient-to-br before:from-primary before:to-accent before:p-[1px]
                 before:[mask-composite:exclude] before:[mask:linear-gradient(black,black)_content-box,linear-gradient(black,black)]">
    <h3 className="text-xl font-bold font-headline mb-2">Gradient Card</h3>
    <p className="text-muted-foreground">This card has a cool gradient border effect.</p>
  </div>
)`,
    tags: ['card', 'gradient', 'glassmorphism'],
    likes: 152,
    createdAt: '1 week ago',
  },
];

export const mockDocs: Doc[] = [
  {
    id: 'doc_1',
    title: 'Getting Started with Next.js 14 Server Actions',
    slug: 'getting-started-with-nextjs-14-server-actions',
    author: mockUsers[2],
    content: `
# Getting Started with Next.js 14 Server Actions

Server Actions are a new feature in Next.js 14 that allows you to run server-side code directly from your React components, without needing to create separate API routes.

## Creating a Server Action

To create a server action, define an \`async\` function in a component and add the \`"use server"\` directive at the top of the function body or the top of the file.

\`\`\`typescript
'use server';

export async function createTodo(formData: FormData) {
  const todo = formData.get('todo');
  // ... logic to save to a database
}
\`\`\`

## Using a Server Action

You can then call this server action from a form's \`action\` attribute.

\`\`\`tsx
import { createTodo } from './actions';

export default function AddTodo() {
  return (
    <form action={createTodo}>
      <input type="text" name="todo" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
\`\`\`
`,
    tags: ['nextjs', 'server-actions', 'react'],
    likes: 310,
    commentsCount: 45,
    createdAt: '2 weeks ago',
  },
    {
    id: 'doc_2',
    title: 'Mastering Tailwind CSS for Responsive Design',
    slug: 'mastering-tailwind-css-for-responsive-design',
    author: mockUsers[3],
    content: `
# Mastering Tailwind CSS for Responsive Design

Tailwind CSS makes responsive design intuitive and fast. Instead of writing custom media queries, you use responsive variants of Tailwind's utility classes.

## Responsive Prefixes

You can make any utility class responsive by prefixing it with a screen size: \`sm:\`, \`md:\`, \`lg:\`, \`xl:\`, \`2xl:\`.

For example, to create a two-column layout on medium screens and a single column on mobile:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>01</div>
  <div>02</div>
</div>
\`\`\`

This will apply \`grid-cols-1\` on small screens and \`grid-cols-2\` on screens 768px and wider.
`,
    tags: ['tailwind-css', 'css', 'responsive-design'],
    likes: 198,
    commentsCount: 22,
    createdAt: '1 month ago',
  },
];


export const mockBugs: BugReport[] = [
    {
        id: 'bug_1',
        title: 'Component preview crashes on mobile',
        description: 'When viewing a component on a screen smaller than `sm`, the live preview area overflows and causes the whole page to crash. This seems to be related to how `react-live` handles responsive rendering.',
        reporter: mockUsers[1],
        upvotes: 23,
        commentsCount: 8,
        createdAt: '2 days ago',
        status: 'Open'
    },
    {
        id: 'bug_2',
        title: 'AI tag generation returns duplicates',
        description: 'The "Generate with AI" button for tags sometimes suggests tags that are already present in the input field, leading to duplicate tags if the user isn\'t paying attention.',
        reporter: mockUsers[3],
        upvotes: 12,
        commentsCount: 3,
        createdAt: '4 days ago',
        status: 'In Progress'
    }
];
