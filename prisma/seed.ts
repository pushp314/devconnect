
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
      username: 'pushprajsharma',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKAaiDrkrfvu3C6GFOJ_36ICnQRa8xaU9PeyNs_B5MWDL0aKNq1=s96-c',
      bio: 'Administrator and lead developer of CodeStudio.',
    },
  });

  console.log('Found/Created admin user:', { adminUser });

  // --- SNIPPETS ---
  const snippets = [
    // JavaScript
    {
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
    },
    {
      title: 'JavaScript Local Storage Wrapper',
      description: 'A simple wrapper for localStorage to handle JSON serialization and parsing automatically.',
      language: 'JavaScript',
      code: `const storage = {
  get: (key) => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error getting from localStorage', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error setting to localStorage', e);
    }
  },
  remove: (key) => {
    window.localStorage.removeItem(key);
  }
};`,
      tags: ['javascript', 'localstorage', 'utility'],
    },
    // TypeScript
    {
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
    },
    {
        title: "TypeScript Enum for API Status",
        description: "A TypeScript enum to represent the status of an API request.",
        language: "TypeScript",
        code: `enum ApiStatus {
    Idle = 'idle',
    Pending = 'pending',
    Success = 'success',
    Error = 'error',
}

// Usage
let currentStatus: ApiStatus = ApiStatus.Idle;`,
        tags: ["typescript", "enum", "api"]
    },
    // Python
    {
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
    },
     {
      title: 'Python Check if File Exists',
      description: 'A simple Python function to check if a file exists at a given path.',
      language: 'Python',
      code: `import os

def file_exists(filepath):
    return os.path.exists(filepath)

# Example
if file_exists("my_file.txt"):
    print("File found!")
else:
    print("File not found.")`,
      tags: ['python', 'file-system', 'utility'],
    },
    // Go
    {
      title: 'Go Simple HTTP Server',
      description: 'A basic HTTP server in Go that listens on port 8080 and responds with "Hello, World!".',
      language: 'Go',
      code: `package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}

func main() {
	http.HandleFunc("/", helloHandler)
	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}`,
      tags: ['go', 'http', 'server', 'backend'],
    },
    {
        title: "Go JSON Marshaling",
        description: "An example of how to marshal a struct into a JSON string in Go.",
        language: "Go",
        code: `package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func main() {
    user := User{Name: "John Doe", Email: "john@example.com"}
    userJson, err := json.Marshal(user)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(string(userJson))
}`,
        tags: ["go", "json", "structs"]
    }
  ];

  for (const snippet of snippets) {
    await prisma.snippet.create({
      data: {
        ...snippet,
        authorId: adminUser.id,
      },
    });
  }

  console.log('Created snippets.');
  
  // --- DOCUMENTS ---
  const docs = [
    {
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
    },
    {
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
    },
    {
      title: 'Mastering Tailwind CSS',
      slug: 'mastering-tailwind-css',
      content: `
# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.

## Core Concepts

- **Utility-First**: Instead of writing custom CSS classes, you apply pre-existing utility classes directly in your HTML.
- **Responsive Design**: Use variants like \`md:\` and \`lg:\` to apply styles at different breakpoints.
- **Just-in-Time Compiler**: Tailwind automatically generates only the CSS you actually use, keeping your final bundle size small.

## Example

\`\`\`html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
\`\`\`
      `,
      tags: ['css', 'tailwind', 'frontend', 'design'],
    }
  ];

  for (const doc of docs) {
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {},
      create: {
        ...doc,
        authorId: adminUser.id,
      },
    });
  }

  console.log('Created documents.');

  // --- MARKETPLACE COMPONENTS ---
  const components = [
    {
      title: "Animated Login Form",
      description: "A beautifully animated login form component built with Framer Motion and Tailwind CSS. Includes input fields for email and password, a submit button, and social login options. Fully responsive and easy to customize.",
      price: 15,
      tags: ["react", "form", "animation", "auth", "tailwind"],
      previewUrls: ["https://picsum.photos/seed/loginform/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: adminUser.id,
    },
    {
      title: "Interactive Data Dashboard",
      description: "A free, responsive dashboard template with charts and stats cards. Built with Recharts and ShadCN UI. A perfect starting point for any data visualization project.",
      price: 0,
      tags: ["react", "dashboard", "charts", "free", "template"],
      previewUrls: ["https://picsum.photos/seed/dashboard/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: adminUser.id,
    }
  ];

  for (const component of components) {
    await prisma.component.create({
      data: component
    });
  }

  console.log("Created marketplace components.");

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
