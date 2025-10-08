
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create or find the admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'pusprajsharma314@gmail.com' },
    update: {},
    create: {
      email: 'pusprajsharma314@gmail.com',
      name: 'Pushp Raj Sharma',
      username: 'pusprajsharma314',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKAaiDrkrfvu3C6GFOJ_36ICnQRa8xaU9PeyNs_B5MWDL0aKNq1=s96-c',
      bio: 'Administrator and lead developer of CodeStudio.',
    },
  });

  console.log('Found/Created admin user:', { adminUser });

  // Create Snippets authored by the admin user
  const snippet1 = await prisma.snippet.create({
    data: {
      title: 'React Debounce Hook',
      description: 'A custom React hook to debounce any value. Useful for handling user input in search fields.',
      language: 'TypeScript',
      code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
      tags: ['react', 'hook', 'typescript', 'debounce'],
      authorId: adminUser.id,
    },
  });

  const snippet2 = await prisma.snippet.create({
    data: {
      title: 'Simple Python Flask Server',
      description: 'A minimal Flask application to serve a simple JSON response. Great for starting a new API.',
      language: 'Python',
      code: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return jsonify(message='Hello, World!')

if __name__ == '__main__':
    app.run(debug=True)`,
      tags: ['python', 'flask', 'api', 'backend'],
      authorId: adminUser.id,
    },
  });

    const snippet3 = await prisma.snippet.create({
    data: {
      title: 'Fetch API with Async/Await',
      description: 'A clean way to fetch data from an API in JavaScript using async/await syntax.',
      language: 'JavaScript',
      code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Example usage:
fetchData('https://api.example.com/data')
  .then(data => console.log(data));`,
      tags: ['javascript', 'fetch', 'async-await', 'api'],
      authorId: adminUser.id,
    },
  });


  console.log('Created snippets:', { snippet1, snippet2, snippet3 });

  // Create Documents authored by the admin user
  const doc1 = await prisma.document.create({
    data: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `
# Getting Started with Next.js

Next.js is a powerful React framework for building server-side rendered and static web applications.

## Installation

To create a new Next.js app, run the following command:
\`\`\`bash
npx create-next-app@latest
\`\`\`

## Key Features

- **File-based Routing**: Create pages by adding files to the \`src/app\` directory.
- **Server Components**: Render components on the server to reduce client-side JavaScript.
- **API Routes**: Easily create API endpoints within your Next.js application.
      `,
      tags: ['nextjs', 'react', 'tutorial', 'webdev'],
      authorId: adminUser.id,
    },
  });

    const doc2 = await prisma.document.create({
    data: {
      title: 'Understanding Prisma Schemas',
      slug: 'understanding-prisma-schemas',
      content: `
# Understanding Prisma Schemas

The Prisma schema is the main configuration file for your Prisma setup. It's where you define your database models and their relations.

## Example Model

Here's an example of a \`User\` and \`Post\` model:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

This schema defines a one-to-many relationship between \`User\` and \`Post\`.
      `,
      tags: ['prisma', 'database', 'orm', 'tutorial'],
      authorId: adminUser.id,
    },
  });

  console.log('Created documents:', { doc1, doc2 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
