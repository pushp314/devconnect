
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- ADMIN USERS ---
  const adminUsers = [
    {
      email: 'pusprajsharma314@gmail.com',
      name: 'Pushp Raj Sharma',
      username: 'pushprajsharma',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKAaiDrkrfvu3C6GFOJ_36ICnQRa8xaU9PeyNs_B5MWDL0aKNq1=s96-c',
      bio: 'Administrator and lead developer of CodeStudio.',
    },
    {
      email: 'newadmin@example.com',
      name: 'Jane Doe',
      username: 'janedoe',
      image: 'https://i.pravatar.cc/150?u=janedoe',
      bio: 'Community Manager and Administrator.',
    }
  ];

  let createdAdminUsers = [];

  for (const admin of adminUsers) {
      const adminUser = await prisma.user.upsert({
        where: { email: admin.email },
        update: { role: Role.ADMIN },
        create: {
          ...admin,
          role: Role.ADMIN,
        },
      });
      createdAdminUsers.push(adminUser);
      console.log('Found/Created admin user:', { adminUser });
  }

  const primaryAdmin = createdAdminUsers[0];


  // --- SNIPPETS ---
  const snippets = [
    // --- React ---
    {
      title: 'Interactive Counter Button',
      description: 'A simple React component demonstrating state management with a counter button. Click the button to increment the number.',
      language: 'React',
      code: `() => {
    const [count, setCount] = React.useState(0);
    return (
        <div class="flex flex-col items-center gap-4 text-center p-4">
            <h3 class="font-headline text-xl">React Counter</h3>
            <p className="text-muted-foreground text-sm">Click the button below to see the count increase.</p>
            <Button onClick={() => setCount(count + 1)} className="w-48">
                <MousePointerClick className="mr-2" />
                Clicked {count} times
            </Button>
        </div>
    )
}`,
      tags: ['react', 'state', 'hooks', 'button', 'interactive'],
    },
    {
      title: 'Dynamic Welcome Message',
      description: 'A React component that displays a welcome message. It uses state to dynamically update content based on user interaction.',
      language: 'React',
      code: `() => {
    const [name, setName] = React.useState('Guest');
    const names = ['Alice', 'Bob', 'Charlie', 'Guest'];
    const changeName = () => {
      const currentIndex = names.indexOf(name);
      const nextIndex = (currentIndex + 1) % names.length;
      setName(names[nextIndex]);
    };

    return (
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold font-headline">Hello, {name}!</h2>
            <Button variant="outline" size="sm" onClick={changeName} className="mt-4">
                Change User
            </Button>
        </div>
    );
}`,
      tags: ['react', 'state', 'dynamic-content'],
    },
     // --- HTML + Tailwind ---
    {
      title: 'Modern Pricing Card',
      description: 'A responsive pricing card styled with Tailwind CSS, featuring a prominent call-to-action button and a list of features.',
      language: 'HTML',
      code: `<div class="w-full max-w-sm mx-auto p-6 bg-card text-card-foreground rounded-xl border shadow-lg">
  <h3 class="text-2xl font-headline font-bold text-center">Pro Plan</h3>
  <p class="text-center text-muted-foreground mt-2">For power users</p>
  <div class="my-6 text-center">
    <span class="text-4xl font-extrabold">$15</span>
    <span class="text-muted-foreground">/month</span>
  </div>
  <ul class="space-y-3 text-sm mb-8">
    <li class="flex items-center gap-2">
      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>Unlimited Snippets</span>
    </li>
    <li class="flex items-center gap-2">
      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>Private Snippets</span>
    </li>
    <li class="flex items-center gap-2">
      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      <span>AI Features</span>
    </li>
  </ul>
  <button class="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
    Get Started
  </button>
</div>`,
      tags: ['html', 'tailwind-css', 'ui', 'card', 'pricing'],
    },
    {
      title: 'Simple Alert Component',
      description: 'A simple alert component styled with Tailwind CSS, suitable for displaying informational messages to the user.',
      language: 'HTML',
      code: `<div class="max-w-md mx-auto p-4 rounded-md border-l-4 border-blue-500 bg-blue-50 text-blue-800">
  <div class="flex items-start">
    <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
    </svg>
    <div>
      <h4 class="font-bold">Information</h4>
      <p class="text-sm">This is an informational alert. Use it to provide helpful tips or updates to your users.</p>
    </div>
  </div>
</div>`,
      tags: ['html', 'tailwind-css', 'alert', 'ui-component'],
    },
    // --- JavaScript ---
    {
      title: 'Log Array Items to Console',
      description: 'A basic JavaScript snippet that iterates over an array of fruits and logs each one to the console.',
      language: 'JavaScript',
      code: `const fruits = ['Apple', 'Banana', 'Cherry', 'Date'];

console.log("Logging all fruits:");
fruits.forEach((fruit, index) => {
    console.log(\`Item \${index + 1}: \${fruit}\`);
});

console.log("...done!");`,
      tags: ['javascript', 'loop', 'array', 'console'],
    },
    {
      title: 'Simple Math Operations',
      description: 'Demonstrates basic arithmetic operations in JavaScript and logs the results to the console for inspection.',
      language: 'JavaScript',
      code: `const a = 10;
const b = 5;

console.log(\`Numbers are a = \${a}, b = \${b}\`);
console.log('Addition:', a + b);
console.log('Subtraction:', a - b);
console.log('Multiplication:', a * b);
console.log('Division:', a / b);`,
      tags: ['javascript', 'math', 'operators', 'console'],
    },
    // --- Python ---
    {
      title: 'Python Fibonacci Sequence',
      description: 'A Python script that generates and prints the first 10 numbers in the Fibonacci sequence.',
      language: 'Python',
      code: `# Fibonacci Sequence
a, b = 0, 1
print("First 10 Fibonacci numbers:")
for _ in range(10):
    print(a)
    a, b = b, a + b`,
      tags: ['python', 'fibonacci', 'loop', 'algorithm'],
    },
    {
      title: 'Python Dictionary Iteration',
      description: 'This snippet demonstrates how to iterate through a Python dictionary and print its key-value pairs.',
      language: 'Python',
      code: `user_info = {
  "name": "Alex",
  "role": "Developer",
  "experience": 5
}

print("User Information:")
for key, value in user_info.items():
    print(f"- {key.capitalize()}: {value}")`,
      tags: ['python', 'dictionary', 'data-structures', 'iteration'],
    },
    // --- Go ---
    {
      title: 'Go Simple HTTP Server',
      description: 'A basic HTTP server in Go that listens on port 8080 and responds with "Hello, World!". This snippet is not previewable.',
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
      description: "An example of how to marshal a struct into a JSON string in Go. This snippet is not previewable.",
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
    await prisma.snippet.upsert({
      where: { title: snippet.title },
      update: {},
      create: {
        ...snippet,
        authorId: primaryAdmin.id,
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
        authorId: primaryAdmin.id,
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
      creatorId: primaryAdmin.id,
    },
    {
      title: "Interactive Data Dashboard",
      description: "A free, responsive dashboard template with charts and stats cards. Built with Recharts and ShadCN UI. A perfect starting point for any data visualization project.",
      price: 0,
      tags: ["react", "dashboard", "charts", "free", "template"],
      previewUrls: ["https://picsum.photos/seed/dashboard/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: primaryAdmin.id,
    }
  ];

  for (const component of components) {
    await prisma.component.upsert({
        where: { title: component.title },
        update: {},
        create: component
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
